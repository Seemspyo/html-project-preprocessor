const
path = require('path'),
fs = require('fs'),
ejs = require('ejs')


const argv = require('minimist')(process.argv.slice(2))

if (!argv.root) {
    console.error('root parameter must be specified.')
    return;
}

const
root = argv.root,
ext = argv.ext || '.html',
data = argv.data || {},
dest = argv.dest || path.resolve(root, '../dest'),
skip = argv.context && new RegExp(argv.context, 'i'),
renderOption = { cache: false, async: true, ...data }

function cleanup(dir) {
    if (!fs.existsSync(dir)) return;
    if (!fs.lstatSync(dir).isDirectory()) throw new Error(`${ dir } is not a directory`);

    for (const junk of fs.readdirSync(dir)) {
        const location = path.join(dir, junk);

        if (fs.lstatSync(location).isDirectory()) cleanup(location);
        else fs.unlinkSync(location);
    }

    fs.rmdirSync(dir);
}

function renderTemplate(root, dest, ext) {
    const
    filter = /\.html$/mi,
    tasks = new Array(),
    counts = { render: 0, copy: 0, skip: 0 }

    if (!fs.existsSync(dest)) fs.mkdirSync(dest)

    for (const filename of fs.readdirSync(root)) {
        if (skip && skip.test(filename)) {
            counts.skip++;
            console.log(`skipped: ${ filename }`);
            continue;
        }

        const inputPath = path.join(root, filename)

        if (filter.test(filename)) {
            tasks.push(
                ejs.renderFile(inputPath, renderOption)
                .then(output => {
                    const outputPath = path.join(dest, filename.replace('.html', ext))

                    fs.writeFileSync(path.join(dest, filename.replace('.html', ext)), output)

                    console.log(`rendered: "${ inputPath }" to "${ outputPath }"`)
                })
            )

            counts.render++;
        } else {
            const stat = fs.lstatSync(inputPath)

            if (stat.isDirectory()) {
                const { tasks: t, counts: { render, copy, skip } } = renderTemplate(inputPath, path.join(dest, filename), ext)

                tasks.concat(t)
                counts.render += render
                counts.copy += copy
                counts.skip += skip;
            } else {
                const outputPath = path.join(dest, filename);

                fs.copyFileSync(inputPath, path.join(dest, filename))
                counts.copy++;

                console.log(`copied: "${ inputPath }" to "${ outputPath }"`)
            }
        }
    }

    return { tasks, counts }
}

cleanup(dest)

const { tasks, counts } = renderTemplate(root, dest, ext)

Promise.all(tasks)
.then(() => console.log(`
    rendered:\t${ counts.render }
    copied:\t${ counts.copy }
    skipped:\t${ counts.skip }
    
    Compile complete
`));
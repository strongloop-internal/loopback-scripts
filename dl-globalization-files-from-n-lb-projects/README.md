# Globalization file download helper

Download globalization files from N LoopBack repos.

## Usage

The files fetched depends on the contents in `file.txt`. Run:

```
git clone git@github.com:strongloop/loopback-scripts.git
cd dl-globalization-files-from-n-lb-projects
./fetch
```

> You need to `cd` into the `dl-globalization-files-from-n-lb-projects` dir to
> run `./fetch`

Then look in the `./downloads` directory to file your downloaded files.

> You can change the contents in `files.txt` to pick the files you want to
> download.

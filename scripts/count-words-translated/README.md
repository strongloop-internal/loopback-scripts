# Get number of translated words

Count the number of words translated from English for repos listed in
`files.txt`.

## Usage

```
npm install && ./fetch && ./count
```

## Details

- Only counts actual words (doesn't count `{0}`, `{{abc}}`, etc)
- Only good for an estimate (there are minor counting bugs with single chars
  like `.` that appear alone for example

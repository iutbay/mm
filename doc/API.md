# Media Manager API

## list
- Method : GET
- Params :
  - `path`

This API call should return an array of files (object) with the following properties :
- `type` : *dir* or *file*
- `path` : e.g. `folder/image.jpg` (no leading slash)
- `basename` : e.g. `image.jpg`
- `extension` : e.g. `jpg`
- `filename` : e.g. `image`

## download
- Method : GET
- Params :
  - `path`

## upload
- Method : POST
- Params :
  - `path`
  - `file`

# Okeears Web UI

## Build UI

* `npm run clean`
* `npm install`
* `npm run build` (production mode)

## Running / Development

* `parcel index.html` or `npx parcel`
* Visit your app at [http://localhost:1234](http://localhost:1234).

## Host locally using nginx container

* sudo docker run --name okeears-nginx -v <path to repo>/webui/dist:/usr/share/nginx/html:ro -p 8080:80 -d nginx
* curl "http://localhost:8080"

# fit-viewer README

Open `.fit` files within `vscode` . 

![Map](screenshots/map.png)

![Table](screenshots/data.png)

![Charts](screenshots/chart.png)

## How to install

* Install the extension: Look for `FIT File Viewer` in the [Marketplace](https://marketplace.visualstudio.com/items?itemName=ThomasCamminady.fit-viewer)
* Right-click on a `.fit` file, select `Open with...`
* Click `Configure default editor for '*.fit'...`
* Click `FIT File Viewer`

Now, whenever you click on a `.fit` file it uses `FIT File Viewer` .

## Develop

```
rm -rf node_modules out    
npm install
npm run compile
npm run package
```

Upload extension to `https://marketplace.visualstudio.com/manage/publishers/thomascamminady`

## Disclaimer 1

No work in this repository is affiliated with my employer, [Wahoo Fitness](http://www.wahoofitness.com). 

## Disclaimer 2

I have no idea what I am doing here. All code was written by ChatGPT and I haven't written a single line of JavaScript or TypeScript on my own. Suggestions to improve this code are very much appreciated.

## Credit

Uses:
* [https://github.com/garmin/fit-javascript-sdk](https://github.com/garmin/fit-javascript-sdk), FIT Protocol License Agreement
* [https://leafletjs.com](https://leafletjs.com), BSD-2-Clause license
* [https://vega.github.io/vega-lite/](https://vega.github.io/vega-lite/), BSD-3-Clause license
* [https://github.com/vega/vega-embed](https://github.com/vega/vega-embed), BSD-3-Clause license

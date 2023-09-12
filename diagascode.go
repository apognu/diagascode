package main

import (
	"context"
	"embed"
	"flag"
	"fmt"
	"html/template"
	"io/fs"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"

	"github.com/chromedp/cdproto/emulation"
	"github.com/chromedp/chromedp"
	"github.com/gin-gonic/gin"
)

//go:embed dist/*
var frontend embed.FS

func main() {
	templates := flag.String("templates", "", "path to the HTML templates to use")
	source := flag.String("diagram", "", "path to the source file for the diagram")
	style := flag.String("css", "", "path to a CSS file to apply to the diagram")
	assets := flag.String("assets", "", "path to a directory containing diagram assets")
	out := flag.String("out", "screenshot.png", "name of the output PNG file")
	port := flag.Int("port", 12345, "port to listen to")

	flag.Parse()

	if *source == "" {
		log.Fatal("a source file must be provided")
	}

	mime.AddExtensionType(filepath.Ext(*source), "application/javascript")

	sub, _ := fs.Sub(frontend, "dist")

	gin.SetMode(gin.ReleaseMode)

	r := gin.New()
	r.StaticFile("/overrides/diagram.js", *source)

	r.GET("/overrides/index.html", func(c *gin.Context) {
		templ := template.Must(template.New("").ParseFS(frontend, "dist/index.html"))
		r.SetHTMLTemplate(templ)

		tmp := []byte{}

		if *templates != "" {
			var err error

			tmp, err = os.ReadFile(*templates)

			if err != nil {
				log.Fatal("could not load template file")
			}
		}

		c.HTML(http.StatusOK, "index.html", gin.H{"templates": template.HTML(string(tmp))})
	})

	if *style != "" {
		r.StaticFile("/overrides/style.css", *style)
	}
	if *assets != "" {
		r.StaticFS("/assets", http.Dir(*assets))
	}

	r.StaticFS("/dist", http.FS(sub))

	go func() {
		r.Run(fmt.Sprintf(":%d", *port))
	}()

	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	var buf []byte

	if err := chromedp.Run(ctx, screenshot("http://127.0.0.1:12345/overrides/index.html", &buf)); err != nil {
		log.Fatal(err)
	}
	if err := os.WriteFile(*out, buf, 0o644); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Diagram generated at `%s`.\n", *out)
}

func screenshot(urlstr string, res *[]byte) chromedp.Tasks {
	return chromedp.Tasks{
		chromedp.ActionFunc(func(ctx context.Context) error {
			return chromedp.EmulateViewport(2160, 1440, func(sdmop *emulation.SetDeviceMetricsOverrideParams, steep *emulation.SetTouchEmulationEnabledParams) {
				sdmop.DeviceScaleFactor = 2
			}).Do(ctx)
		}),
		chromedp.Navigate(urlstr),
		chromedp.Screenshot("#dac-area", res, chromedp.NodeVisible),
	}
}

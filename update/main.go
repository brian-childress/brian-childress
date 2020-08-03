package main

// Inspired by: https://github.com/victoriadrake/victoriadrake/blob/master/update/main.go

import (
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"strings"

	"github.com/mmcdole/gofeed"
)

func getenv(name string) (string, error) {
	v := os.Getenv(name)
	if v == "" {
		return v, errors.New("no environment variable: " + name)
	}
	return v, nil
}

func getRSS(rssFeed string) ([]string, error) {
	if rssFeed == "" {
		return []string{""}, errors.New("no feeds present")
	}
	return strings.Split(rssFeed, ";"), nil
}

func makeReadme(filename string) error {
	
	fp := gofeed.NewParser()
	feed, err := fp.ParseURL("https://brianchildress.co/atom.xml")

	if err != nil {
		log.Fatalf("error getting feed: %v", err)
	}

	// Get the latest item
	rssItem := feed.Items[0]

	// Get Header
	header, err := ioutil.ReadFile("header.md")

	if err != nil {
		log.Fatalf("cannot read file: %v", err)
		return err
	}

	// Get Footer
	footer, err := ioutil.ReadFile("footer.md")

	if err != nil {
		log.Fatalf("cannot read file: %v", err)
		return err
	}

	stringHeader := string(header)
	stringFooter := string(footer)

	blog := "- Read my latest blog post: **[" + rssItem.Title + "](" + rssItem.Link + ")**"
	data := fmt.Sprintf("%s%s\n\n%s\n", stringHeader, blog, stringFooter)

	// Prepare file with a light coating of os
	file, err := os.Create(filename)
	
	if err != nil {
		return err
	}

	defer file.Close()

	_, err = io.WriteString(file, data)

	if err != nil {
		return err
	}
	
	return file.Sync()

}

func main() {

	makeReadme("../README.md")

}
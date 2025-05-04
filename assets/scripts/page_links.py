import os, sys, re

def main():
    write = "--write" in sys.argv

    page_titles = get_all_titles("world")
    add_page_links("index.md", page_titles, write)
    add_page_links("world", page_titles, write)
    add_page_links("stories", page_titles, write)

    if not write:
        print("Add the --write flag to modify the scanned files")

# replace the [[short links]] in each markdown file with proper links
def add_page_links(path: str, page_titles: dict[str, str], write: bool):

    # if the path is a markdown file, modify its content
    if os.path.isfile(path) and os.path.splitext(path)[1] == ".md":

        # open the file
        with open(path) as file:
            content = file.read()

        # substitute the links
        for title in page_titles:
            content = content.replace(f"[[{title}]]", f"[{title}]({{{{ site.baseurl }}}}{{% link {page_titles[title]} %}})")

            # report self links
            if not write and path == page_titles[title]:
                print(f"Self link at {path}")

        # find unmatched links
        links = re.findall(r"\[\[(.+?)\]\]", content)

        # report unmatched links
        if not write:
            for title in links:
                print(f"Missing link: {title}")

        # remove brackets around unmatched links
        content = re.sub(r"\[\[(.+?)\]\]", r"\1", content)

        # write the changes to the file
        if write:
            with open(path, "w") as file:
                file.write(content)

    # if the path is a directory, recurse on its subpaths
    elif os.path.isdir(path):
        for relative_path in os.listdir(path):
            add_page_links(os.path.join(path, relative_path), page_titles, write)

# recursively create a dictionary associating page titles with file paths
def get_all_titles(path: str) -> dict[str, str]:

    # initialize the dictionary of titles
    page_titles = {}

    # get the title of the page if the path points to a file
    if os.path.isfile(path):
        page_titles[get_page_title(path)] = path

    # recurse into directories
    if os.path.isdir(path):
        for entry in os.listdir(path):
            page_titles.update(get_all_titles(os.path.join(path, entry)))

    return page_titles

# get the title of a page from its front matter
def get_page_title(path: str) -> str:

    # if the path is a file, read it and look for a title
    if os.path.isfile(path):
        with open(path) as file:
            for line in file:
                if line.startswith("title:"):
                    return line[6:].strip()

    # raise an exception if the path is not a file or if the page has no title
    raise RuntimeError(path + " is not a file or has no title")

if __name__ == "__main__":
    main()

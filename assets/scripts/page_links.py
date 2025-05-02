import os

def main():
    page_titles = get_all_titles("world")
    add_page_links("world", page_titles)
    add_page_links("stories", page_titles)

# replace the [[short links]] in each markdown file with proper links
def add_page_links(path: str, page_titles: dict[str, str]):

    # if the path is a markdown file, modify its content
    if os.path.isfile(path) and os.path.splitext(path)[1] == ".md":

        # open the file
        with open(path) as file:
            content = file.read()

        # substitute the links
        for title in page_titles:
            content = content.replace(f"[[{title}]]", f"[{title}]({{{{ site.baseurl }}}}{{% link {page_titles[title]} %}})")

        # write the changes to the file
        with open(path, "w") as file:
            file.write(content)

    # if the path is a directory, recurse on its subpaths
    elif os.path.isdir(path):
        for relative_path in os.listdir(path):
            add_page_links(os.path.join(path, relative_path), page_titles)

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
    raise RuntimeError(os.path.join(os.getcwd(), path) + " is not a file or has no title")

if __name__ == "__main__":
    main()

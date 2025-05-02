import os, re

def main():
    add_page_links("world")
    add_page_links("stories")

# replace the [[short links]] in each .md file with markdown links and liquid
def add_page_links(path: str):

    # if the path is a .md file, modify its content
    if os.path.isfile(path) and os.path.splitext(path)[1] == ".md":

        # open the file
        with open(path) as file:
            content = file.read()

        # substitute the links
        content = re.sub(r"\[\[(.+?)\]\]", r"[\1]({% assign linked_page = site.pages | find: 'title', '\1' %}{{ site.baseurl }}{% link {{ linked_page.url }} %})", content)

        # write the changes to the file
        with open(path, "w") as file:
            file.write(content)

    # if the path is a directory, recurse on its subpaths
    elif os.path.isdir(path):
        for relative_path in os.listdir(path):
            add_page_links(os.path.join(path, relative_path))

if __name__ == "__main__":
    main()

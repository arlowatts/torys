import os

def main():
    append_dir_list(("world", "stories"))

# create a list of the current directory's contents and append it its index file
def append_dir_list(dir_list: tuple):
    index_path = "index.md"

    # check that the directory contains an index file to write to
    if os.path.isfile(index_path):
        # check that the directory does not contain only the index file
        if len(dir_list) > 1:
            content = "\n## Read More\n\n"

            # add each path to the list except the index file
            for path in dir_list:
                if os.path.basename(path) != "index.md":
                    content += get_list_entry(path)

                    # if the path is a directory, recurse
                    if os.path.isdir(path):
                        os.chdir(path)
                        append_dir_list(sorted(os.listdir()))
                        os.chdir("..")

            with open(index_path, "a") as file:
                file.write(content)

# get a file or directory's list entry in markdown format
def get_list_entry(path: str):
    if os.path.isfile(path):
        return "- [" + get_page_title(path) + "](" + path + ")\n"

    elif os.path.isdir(path):
        return get_list_entry(os.path.join(path, "index.md"))

    else:
        raise RuntimeError(os.path.join(os.getcwd(), path) + " is not a file or directory")

# read the title of the page from the page's front matter
def get_page_title(path: str):
    if os.path.isfile(path):
        with open(path) as file:
            for line in file:
                if line.startswith("title:"):
                    return line[line.find(":") + 1 :].strip()

    raise RuntimeError(os.path.join(os.getcwd(), path) + " does not have a title")

if __name__ == "__main__": main()

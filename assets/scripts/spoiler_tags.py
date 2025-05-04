import os, sys

def main():
    write = "--write" in sys.argv

    add_spoiler_tags("world", write)
    add_spoiler_tags("stories", write)

    if not write:
        print("Add the --write flag to modify the scanned files")

# replace the <spoiler> tags in each markdown file with {: .spoiler} attributes
def add_spoiler_tags(path: str, write: bool):

    # if the path is a markdown file, modify its content
    if os.path.isfile(path) and os.path.splitext(path)[1] == ".md":

        # open the file
        with open(path) as file:
            content = ""
            is_spoiler = False
            updated = False

            # update the spoiler flag or add an attribute to the line
            for line in file:

                # capture opening spoiler tags
                if line == "<spoiler>\n":
                    if is_spoiler:
                        raise SpoilerError(path)

                    is_spoiler = True
                    updated = True

                # capture closing spoiler tags
                elif line == "</spoiler>\n":
                    if not is_spoiler:
                        raise SpoilerError(path)

                    is_spoiler = False

                # repeat other lines and add spoiler attributes
                else:
                    if is_spoiler and line.isspace():
                        content += "{: .spoiler}\n"

                    content += line

            # check that the spoiler tags are properly matched
            if is_spoiler:
                raise SpoilerError(path)

        # write the changes to the file
        if write and updated:
            with open(path, "w") as file:
                file.write(content)

    # if the path is a directory, recurse on its subpaths
    elif os.path.isdir(path):
        for relative_path in os.listdir(path):
            add_spoiler_tags(os.path.join(path, relative_path), write)

# use a custom exception class to report mismatched spoiler tags
class SpoilerError(Exception):
    def __init__(self, path: str):
        super().__init__("mismatched spoiler tags in " + path)

if __name__ == "__main__":
    main()

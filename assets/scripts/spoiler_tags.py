import os

def main():
    add_spoiler_tags("world")
    add_spoiler_tags("stories")

# replace the <spoiler> tags in each markdown file with {: .spoiler} attributes
def add_spoiler_tags(path: str):

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
        if updated:
            with open(path, "w") as file:
                file.write(content)

    # if the path is a directory, recurse on its subpaths
    elif os.path.isdir(path):
        for relative_path in os.listdir(path):
            add_spoiler_tags(os.path.join(path, relative_path))

# use a custom exception class to report mismatched spoiler tags
class SpoilerError(Exception):
    def __init__(self, path: str):
        super().__init__("mismatched spoiler tags in " + path)

if __name__ == "__main__":
    main()

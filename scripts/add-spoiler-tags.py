import os

def main():
    add_spoiler_tags("world")
    add_spoiler_tags("stories")

# replace the <spoiler> tags in each .md file with {: .spoiler} attributes
def add_spoiler_tags(path: str):
    # if the path is a .md file, modify its content
    if os.path.isfile(path) and os.path.splitext(path)[1] == ".md":
        with open(path) as file:
            content = ""

            isSpoiler = False

            # update the spoiler flag or add an attribute to the line
            for line in file:
                if line == "<spoiler>\n":
                    isSpoiler = True

                elif line == "</spoiler>\n":
                    isSpoiler = False

                else:
                    # add the spoiler tag to the previous block
                    if isSpoiler and line.isspace():
                        content += "{: .spoiler}\n"

                    # add the actual line to the file
                    content += line

        # write the changes to the file
        with open(path, "w") as file:
            file.write(content)

    # if the path is a directory, recurse on its subpaths
    elif os.path.isdir(path):
        for relativePath in os.listdir(path):
            add_spoiler_tags(os.path.join(path, relativePath))

if __name__ == "__main__": main()

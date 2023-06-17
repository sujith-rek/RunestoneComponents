import { ActiveCode } from "./activecode.js";

export default class BrythonActiveCode extends ActiveCode {
    constructor(opts) {
        super(opts);
        opts.alignVertical = true;
        this.python3_interpreter = $(orig).data("python3_interpreter");
        this.output_height = $(orig).data("output_height");
        $(this.runButton).text("Render");
        this.editor.setValue(this.code);
    }

    async runProg() {
        var prog = await this.buildProg(true);
        let saveCode = "True";
        this.saveCode = await this.manage_scrubber(saveCode);
        $(this.output).text("");
        if (!this.alignVertical) {
            $(this.codeDiv).switchClass("col-md-12", "col-md-6", {
                duration: 500,
                queue: false,
            });
        }
        $(this.outDiv).show({ duration: 700, queue: false });
        prog = `
        <html>
        <head>
            <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/brython@3.9.5/brython.min.js"></script>
            <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/brython@3.9.5/brython_stdlib.min.js"></script>
            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.0.1/styles/default.min.css">
            <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.0.1/highlight.min.js"></script>
            <style>
                html, body{
                    height: max-content; width: 100%;
                }
                .container-pre{
                    background: white; font-size: 13px; line-height: 1.42857143; border: 1px solid #ccc; border-radius: 4px; visibility: hidden;
                    position: fixed; bottom: 0px; width: 94%; max-width: 96%; max-height: 200px; overflow: auto; clear: both; resize: both; transform: scale(1, -1);
                }
                pre {
                    position: sticky; padding: 12px; transform: scale(1, -1);
                }
                code{
                    border: 1px solid #ccc; border-radius: 4px;
                }
            </style>
        </head>
        <body onload='brython()'>
            <script type='text/python'>
import sys
from browser import document, html
import traceback
preElem = html.PRE()
logger = html.CODE()
container = html.DIV()
container.classList.add("container-pre")
preElem <= logger
container <= preElem
class NewOut:
    def write(self, data):
        logger.innerHTML += str(data)
        container.style.visibility = "visible"
sys.stderr = sys.stdout = NewOut()
def my_exec(code):
    try:
        exec(code, locals())
        out_header = document.createElement("text")
        out_header.innerHTML = "Output"
        out_header.style.font = "24px 'Arial'"
        logger.classList.add("plaintext")
        preElem.prepend(document.createElement("br"))
        preElem.prepend(document.createElement("br"))
        preElem.prepend(out_header)
        document <= container
    except SyntaxError as err:
        error_class = err.__class__.__name__
        detail = err.args[0]
        line_number = f"at line {err.lineno}"
    except BaseException as err:
        error_class = err.__class__.__name__
        detail = err.args[0]
        cl, exc, tb = sys.exc_info()
        # When errors don't specify a line
        try:
            line_number = f"at line {traceback.extract_tb(tb)[-1][1]}"
        except:
            line_number = ""
    else:
        return
    
    # This is only done if an Exception was catched
    result = f"'{error_class}': {detail} {line_number}"
    print(result)
    # Styling the pre element for error
    error_header = document.createElement("h3")
    error_header.innerHTML = "Error"
    error_header.style.font = "24px 'Arial'"
    preElem.prepend(error_header)
    container.style.backgroundColor = "#f2dede"
    container.style.border = "1px solid #ebccd1"
    logger.classList.add("plaintext")
    document <= container
my_prog = ${JSON.stringify(prog)}
my_exec(my_prog)
document <= html.SCRIPT("hljs.highlightAll();")
document <= html.SCRIPT("let container = document.querySelector('.container-pre'); let height = container.offsetHeight; document.body.style.paddingBottom = String(height)+'px';")
            </script>
        </body>
        </html>
        `;
        this.output.srcdoc = prog;
    }

    createOutput() {
        this.alignVertical = true;
        var outDiv = document.createElement("div");
        $(outDiv).addClass("ac_output");
        if (this.alignVertical) {
            $(outDiv).addClass("col-md-12");
        } else {
            $(outDiv).addClass("col-md-5");
        }

        if (this.output_height == undefined) {
            this.output_height = "400px";
        }

        this.outDiv = outDiv;
        this.output = document.createElement("iframe");
        $(this.output).css("background-color", "white");
        $(this.output).css("position", "relative");
        // $(this.output).css("height", $(this.output_height));
        this.output.style.height = this.output_height;
        $(this.output).css("width", "100%");
        outDiv.appendChild(this.output);
        this.outerDiv.appendChild(outDiv);
        var clearDiv = document.createElement("div");
        $(clearDiv).css("clear", "both"); // needed to make parent div resize properly
        this.outerDiv.appendChild(clearDiv);
    }
    enableSaveLoad() {
        $(this.runButton).text($.i18n("msg_activecode_render"));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("terminal-input");
    const output = document.getElementById("terminal-output");

    const confessions = {
        "Confession_1": {
            encrypted: "U2FsdGVkX1+randomexampledata==",
            hint: "This one is about how everything started.",
            decrypted: "The real confession 1 goes here."
        }
    };

    function printLine(text, type = "normal") {
        const line = document.createElement("div");
        line.className = "line " + type;
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function cmd_help() {
        printLine("Available commands:\n" +
        "help                 - Show all commands\n" +
        "about                - About this terminal\n" +
        "decrypt <name>       - Decrypt a confession\n" +
        "hint <name>          - Get hints (alias: hind)\n" +
        "show_confessions     - List all confession names\n" +
        "gift                 - Reveal the gift\n" +
        "run surprise         - Play the surprise animation\n" +
        "clear                - Clear the terminal\n" +
        "thanks               - Start birthday flow");
    }

    function cmd_about() {
        printLine("Terminal Of 25 Confessions – made with care and love.\nBuilt for a private, intimate experience.");
    }

    function cmd_show_confessions() {
        printLine("Available confessions:");
        Object.keys(confessions).forEach(c => printLine(" - " + c));
    }

    function cmd_hint(name) {
        if (!name) return printLine("Usage: hint <Confession_1>", "error");

        const c = confessions[name];
        if (!c) return printLine("Confession not found.", "error");

        printLine("Hint: " + c.hint);
    }

    function cmd_decrypt(name) {
        if (!name) return printLine("Usage: decrypt <Confession_1>", "error");

        const c = confessions[name];
        if (!c) return printLine("Confession not found.", "error");

        printLine("Decrypting...");
        setTimeout(() => {
            printLine("Decrypted message: " + c.decrypted, "success");
        }, 500);
    }

    function cmd_gift() {
        printLine("Gift unlocked, now check your wallet.", "success");
    }

    function cmd_run_surprise() {
        printLine("Running surprise...");
        setTimeout(() => {
            printLine("✨ Surprise loaded! Enjoy the moment. ✨", "success");
        }, 500);
    }

    function start_birthday_flow() {
        printLine("Starting birthday message...");
        setTimeout(() => {
            printLine("Happy Birthday! 🎉💖", "success");
        }, 500);
    }

    function runCommand(command) {
        printLine("> " + command, "command");

        const args = command.trim().split(" ");
        const cmd = args.shift();

        switch (cmd) {
            case "help": cmd_help(); break;
            case "about": cmd_about(); break;
            case "decrypt": cmd_decrypt(args[0]); break;
            case "show_confessions": cmd_show_confessions(); break;

            // 👉 Corrected block: hint + hind alias
            case "hint":
            case "hind":
                cmd_hint(args[0]);
                break;

            case "gift": cmd_gift(); break;

            case "run":
                if (args[0] === "surprise") cmd_run_surprise();
                else printLine("Unknown run target.", "error");
                break;

            case "clear":
                output.innerHTML = "";
                printLine("Cleared.");
                break;

            case "thanks":
                start_birthday_flow();
                break;

            case "":
                break;

            default:
                printLine("Command not found. Type help.", "error");
        }
    }

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const cmd = input.value.trim();
            input.value = "";
            runCommand(cmd);
        }
    });

    printLine("Welcome to the Terminal Of 25 Confessions.");
    printLine("Type 'help' to begin.");
});



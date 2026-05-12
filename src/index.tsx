import { findByProps } from "@vendetta/metro";

const MessageActions = findByProps("sendMessage");

let originalSend: any = null;

function formatText(text: string): string {
    if (!text) return text;

    text = text.trim();

    if (
        text.startsWith("/") ||
        text.startsWith("!") ||
        text.startsWith(".")
    ) {
        return text;
    }

    text = text.replace(/^([a-z])/, (c) => c.toUpperCase());

    if (!/[.!?]$/.test(text)) {
        text += ".";
    }

    return text;
}

export default {
    onLoad() {
        originalSend = MessageActions.sendMessage;

        MessageActions.sendMessage = function (
            channelId: string,
            message: any,
            ...args: any[]
        ) {
            if (message?.content) {
                message.content = formatText(message.content);
            }

            return originalSend.call(
                this,
                channelId,
                message,
                ...args
            );
        };

        console.log("AutoFormalizer loaded");
    },

    onUnload() {
        if (originalSend) {
            MessageActions.sendMessage = originalSend;
        }

        console.log("AutoFormalizer unloaded");
    }
};

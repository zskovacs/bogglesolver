export class Trie {
    public ALPHABET_SIZE = 26;
    public ASCII_OFFSET = 'A'.charCodeAt(0);

    public children: Array<Trie>;
    public isEndOfWord = false;

    contains(str: string): boolean {
        var curNode: Trie = this;
        var trstr = str.trim();

        for (var i = 0; i < trstr.length; i++) {
            var idx = trstr.charCodeAt(i) - this.ASCII_OFFSET;
            if (curNode.children && curNode.children[idx]) {
                curNode = curNode.children[idx];
            } else {
                return false;
            }
        }
        return curNode.isEndOfWord;
    }

    has(ch: string): boolean {
        if (this.children) {
            return this.children[ch.charCodeAt(0) - this.ASCII_OFFSET] != undefined;
        }
        return false;
    }

    next(ch: string): Trie {
        if (this.children) {
            return this.children[ch.charCodeAt(0) - this.ASCII_OFFSET];
        }
        return undefined;
    }

    insert(str: string): Trie {
        var curNode: Trie = this;
        var trstr = str.trim();

        for (var i = 0; i < trstr.length; i++) {
            var idx = trstr.toUpperCase().charCodeAt(i) - this.ASCII_OFFSET;

            if (curNode.children == null) {
                curNode.children = new Array<Trie>(this.ALPHABET_SIZE);
                curNode = curNode.children[idx] = new Trie();
            } else if (curNode.children[idx]) {
                curNode = curNode.children[idx];
            } else {
                curNode = curNode.children[idx] = new Trie();
            }
        }

        curNode.isEndOfWord = true;
        return curNode;
    }
}
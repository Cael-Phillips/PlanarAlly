import { socket } from "./socket";
import gameManager from "./planarally";
export default class Note {
    constructor(Name, Text, uid) {
        this.Name = Name;
        this.Text = Text;
        this.name = Name;
        this.text = Text;
        this.uuid = uid;
        this.dialog = $('<div class="dialog notedialog" title="Note"><textarea class="spanrow">' + this.text + '</textarea></div>');
        this.dialog.dialog({
            title: this.name,
            autoOpen: false,
            width: 'auto',
            resizable: false,
            buttons: [
                {
                    text: "Rename",
                    icon: "ui-icon-pencil",
                    click: () => {
                        let renameDialog = $('<div class="dialog"><input type="text" id="renameNote"></div>');
                        renameDialog.dialog({
                            title: "Renaming: '" + this.name + "'",
                            autoOpen: true,
                            width: 'auto',
                            resizable: false,
                            buttons: [
                                {
                                    text: "Confirm",
                                    icon: "ui-icon-check",
                                    click: () => {
                                        let editName = renameDialog.children().eq(0);
                                        this.name = editName.val();
                                        this.dialog.dialog({
                                            title: this.name
                                        });
                                        $('#menu-notes button[note-id=' + this.uuid + ']').html(this.name);
                                        this.updateNote();
                                        renameDialog.dialog("close");
                                    }
                                },
                                {
                                    text: "Cancel",
                                    icon: "ui-icon-cancel",
                                    click: function () {
                                        $(this).dialog("close");
                                    }
                                },
                            ]
                        });
                    }
                },
                {
                    text: "Delete",
                    icon: "ui-icon-trash",
                    click: () => {
                        $('#menu-notes button[note-id="' + this.uuid + '"]').remove();
                        gameManager.notes.remove(this.uuid);
                        this.dialog.dialog("close");
                        this.dialog.remove();
                        socket.emit("deleteNote", this.uuid);
                    },
                    showText: false
                }
            ]
        });
        this.dialog.children().eq(0).bind('input propertychange', () => {
            this.text = this.dialog.children().eq(0).val();
            this.updateNote();
        });
    }
    updateNote() {
        socket.emit("updateNote", this.asDict());
    }
    show() {
        this.dialog.dialog({ title: this.name });
        this.dialog.children().eq(0).val(this.text);
        this.dialog.dialog("open");
    }
    asDict() {
        return { "uuid": this.uuid, "name": this.name, "text": this.text };
    }
}
//# sourceMappingURL=note.js.map
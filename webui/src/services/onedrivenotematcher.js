class OneDriveNoteMatcher {
    getNotebookIdByOneDriveTag(etag) {
        throw "Not Implemented";
    }

    getOneDriveEtagByNotebookId(notebookId) {
        return notebookId.substr(2);
    }
}

// Single instance pattern
export default new OneDriveNoteMatcher();

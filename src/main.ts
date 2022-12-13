import "@blocksuite/blocks";
import "@blocksuite/editor";
import "@blocksuite/blocks/style";
import { createEditor, createDebugMenu, BlockSchema } from "@blocksuite/editor";
import { Workspace, Page } from "@blocksuite/store";
import "./style.css";

/**
 * Manually create initial page structure.
 * In collaboration mode or on page refresh with local persistence,
 * the page structure will be automatically loaded from provider.
 * In these cases, this function should not be called.
 */
function createInitialPage(workspace: Workspace) {
  workspace.signals.pageAdded.once((id) => {
    const page = workspace.getPage(id) as Page;
    const pageBlockId = page.addBlock({ flavour: "affine:page" });
    const groupId = page.addBlock({ flavour: "affine:group" }, pageBlockId);
    page.addBlock({ flavour: "affine:paragraph" }, groupId);
  });

  workspace.createPage("page0");
}

// Subscribe for page update and create editor after page loaded.
function subscribePage(workspace: Workspace) {
  workspace.signals.pageAdded.once((pageId) => {
    const page = workspace.getPage(pageId) as Page;
    const editor = createEditor(page);
    const debugMenu = createDebugMenu(workspace, editor);
    document.body.appendChild(editor);
    document.body.appendChild(debugMenu);
  });
}

function main() {
  const workspace = new Workspace({}).register(BlockSchema);
  subscribePage(workspace);
  createInitialPage(workspace);
}

main();

# Multipaste

Multipaste is a Figma plugin that allows for copy and pasting elements to many frames at once. No more pasting frame-by-frame! Use this plugin to boost your workflow.

## Shortcut

A simpler way to use plugins is by creating shortcuts. To create a shortcut, click on Figma at your system's navbar, then 'Services', 'Services Preferences', 'App shortcuts' and add a new shortcut for Figma. If you wish to use Multipaste with a shortcut, here is my suggested path:

- For copying
  > Menu title: Plugins->Multipaste->Copy (⌃⌘C)
- For pasting
  > Menu title: Plugins->Multipaste->Copy (⌃⌘V)

If you wish, you can also create a shortcut for clearing plugin cache by following the same procedure. Just switch the command and choose a shortcut

### What can this plugin do:

- Copying multiple nodes, either nested in frames or in the page itself, at once and then pasting all of them into multiple frames or groups at once;
- If any of the copied nodes is a component, it will create an instance of it and paste the instance, not duplicate the component;
- Nodes that were copied from another frame will maintain its position in the new frame;
- Nodes that weren't in a frame when copied will be placed in the center of the frames they get pasted into (same behaviour Figma already implements for copy/pasting).

### What can't this plugin do:

- This plugin won't work properly if you delete a copied node before pasting it first. It will still work for nodes that weren't deleted though. In fact, any changes made to the node between copy and pasting will be carried on to the paste. For example, if you copy an element, change its color, and then paste it, it will be of the new color you assigned, and not the original color of when you copied it.
- This plugin doesn't access your system's clipboard, so you may not use regular copy/pasting commands to make it work;

## Plugin Development

### Requirement

- Node 14 or newer

### Getting started

Clone the repository and install all the dependencies.

```sh
git clone git@github.com:marceloblaz/multipaste.git
cd multipaste
npm install
```

### Development

Run the `dev` command to watch all your changes during the development.

```sh
npm run dev
```

> ⚠️ Do not use the code generated by this command as the final version of the plugin, as this command bloats the code to help the development. Run the `build` command before, as described in the next section.

### Build

Run the build command to generate the optimized final version of the code to be used by Figma.

```sh
npm run build
```

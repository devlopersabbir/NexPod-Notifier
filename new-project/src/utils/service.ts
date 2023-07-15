export const getSelectedText = () => {
  const selectedText = document.getSelection()?.toString()?.trim()?.replace(/[^0-9]/g, "")?.trim();
  return selectedText;
};

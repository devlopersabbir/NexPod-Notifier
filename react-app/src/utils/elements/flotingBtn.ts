export const createFloatingButton = () => {
  const containerForSetIcon = document.querySelector(".lyteTableScroll");
  console.log("container: ", containerForSetIcon)
  const createButton = document.createElement("img");
  createButton.src = "https://img.icons8.com/?size=512&id=108653&format=png";
  createButton.id = "floatingIconButton";
  createButton.alt = "icon button";
  createButton.style.cursor = "pointer";
  createButton.style.position = "absolute";
  createButton.style.width = "50px";
  createButton.style.height = "50px";
  createButton.style.top = "49px";
  createButton.style.right = "30%";
  createButton.style.zIndex = "99999999999";

  document.body.appendChild(createButton);
};


const metaViewport = document.createElement("meta");
metaViewport.setAttribute("name", "viewport");
metaViewport.setAttribute("content", "width=device-width, initial-scale=1");
document.head.appendChild(metaViewport);

const Confirm = () => {
  return (
    <div>
      <h1>Tak for dit køb!</h1>
      <p>Vi sætter pris på din handel hos os. Du vil modtage en bekræftelses-e-mail inden længe.</p>
      {}
    </div>
  );
};
export default Confirm
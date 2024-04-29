import { Helmet } from "react-helmet";
import { useEffect } from "react";

const Confirm = () => {

  useEffect(() => {
    const metaViewport = document.createElement("meta");
    metaViewport.setAttribute("name", "viewport");
    metaViewport.setAttribute("content", "width=device-width, initial-scale=1");
    document.head.appendChild(metaViewport);

    // Returnér en clean-up funktion for at fjerne det tilføjede meta-tag
    return () => {
      document.head.removeChild(metaViewport);
    };
  }, []);

  return (
    <div>
      <h1>Tak for dit køb!</h1>
      <p>Vi sætter pris på din handel hos os. Du vil modtage en bekræftelses-e-mail inden længe.</p>
      {}
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
    </div>
  );
};
export default Confirm
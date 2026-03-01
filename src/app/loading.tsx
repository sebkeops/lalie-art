export default function Loading() {
  return (
    <main className="brandLoader">
      <div className="brandLoaderMark" aria-hidden="true">
        <img
          src="/logo-secondaire.png"
          alt=""
          className="brandLoaderImg"
        />
      </div>
      <div className="brandLoaderText">Chargement…</div>
    </main>
  );
}
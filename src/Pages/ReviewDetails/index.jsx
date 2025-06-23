import React, { useState, useEffect, useRef } from "react";
// import bookImg from "../../assets/bookImg.png";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link, useLocation } from "react-router-dom";
import { formatDateToBR } from "../../utils/formatedData";

const ReviewDetails = () => {
  const location = useLocation();
  const review = location.state?.review;
  const [showMoreSynopsis, setShowMoreSynopsis] = useState(false);
  const [showMoreComment, setShowMoreComment] = useState(false);
  const [hasOverflowSynopsis, setHasOverflowSynopsis] = useState(false);
  const [hasOverflowComment, setHasOverflowComment] = useState(false);

  const synopsisRef = useRef(null);
  const commentRef = useRef(null);

  const checkOverflow = (element) => {
    if (!element) return false;
    return element.scrollHeight > element.clientHeight;
  };

  useEffect(() => {
    const synopsisEl = synopsisRef.current;
    const commentEl = commentRef.current;

    const handleResize = () => {
      setHasOverflowSynopsis(checkOverflow(synopsisEl));
      setHasOverflowComment(checkOverflow(commentEl));
    };

    const raf = requestAnimationFrame(handleResize);

    const resizeObserver = new ResizeObserver(handleResize);
    if (synopsisEl) resizeObserver.observe(synopsisEl);
    if (commentEl) resizeObserver.observe(commentEl);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [showMoreSynopsis, showMoreComment]);

  return (
    <section className="w-full min-h-[100vh] text-brandsteel">
      {review ? (
        <div className="w-full h-full px-4 md:px-10 py-8 text-brandsteel">
          {/* Breadcrumb */}
          <div className="text-sm mb-6 text-brandsoftgray px-[45px] mt-[5rem]">
            <Link to="/" className="hover:text-brandprimary">
              Home
            </Link>
            <span className="mx-1 text-brandsoftgray">/</span>
            <Link to="/resenhas" className="hover:text-brandprimary">
              Resenhas
            </Link>
            <span className="mx-1 text-brandsoftgray">/</span>
            <span className="text-brandprimary">Nome do projeto</span>
          </div>

          {/* Conteúdo principal */}
          <div className="w-full flex items-center justify-around flex-col md:flex-row gap-8 md:p-[40px] md:pt-0 mt-[30px]">
            {/* Imagem */}
            <div className="flex-shrink-0 w-[20rem] max-sm:w-[15rem] md:w-[22rem]">
              <img
                src={review.imageUrl}
                alt={review.name}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Informações */}
            <div className="flex flex-col gap-4">
              <div>
                {/* Título */}
                <h1 className="text-2xl md:text-[40px] font-bold text-black">
                  {review.name}
                </h1>

                {/* Data e episódios */}
                <div className="text-sm flex items-center max-sm:justify-between sm:justify-between text-brandsoftgray mt-[5px]">
                  <p>
                    {review.startDate && (
                      <>
                        {formatDateToBR(review.startDate)} -{" "}
                        {review.endDate ? (
                          formatDateToBR(review.endDate)
                        ) : review.status === "Abandonei" ? (
                          <span className="text-brandalert">Abandonei</span>
                        ) : null}
                      </>
                    )}
                  </p>
                  <p>
                    {review.totalPag
                      ? `Páginas: ${review.consumed}/${review.totalPag}`
                      : `Episódios: ${review.consumed}/${review.totalEp}`}
                  </p>
                </div>

                {/* Avaliação e tipo */}
                <div className="flex items-center max-sm:justify-between sm:justify-between mt-[5px]">
                  <div className="flex items-center">
                    <Rating
                      name={`rating-${review._id}`}
                      value={review.rating}
                      precision={0.5}
                      readOnly
                      size="medium"
                    />
                    {review.favorite && (
                      <Stack spacing={1}>
                        <Rating
                          name={`favorite-${review._id}`}
                          value={1}
                          max={1}
                          readOnly
                          icon={<FavoriteIcon fontSize="inherit" />}
                          sx={{
                            "& .MuiRating-iconFilled": {
                              color: "#f44336",
                            },
                          }}
                        />
                      </Stack>
                    )}
                  </div>
                  <span className="bg-brandmistblue text-branddeepblue text-xs font-semibold px-3 py-1 rounded-full">
                    {review.category?.name}
                  </span>
                </div>
              </div>

              {/* Sinopse */}
              <div className="mt-[30px]">
                <h2 className="text-brandmediumblue font-medium mb-1">
                  Sinopse
                </h2>
                <p
                  ref={synopsisRef}
                  className={`text-sm text-brandsteel leading-relaxed transition-all duration-300 ease-in-out ${
                    showMoreSynopsis ? "" : "line-clamp-3"
                  }`}
                >
                  {review.synopsis}
                </p>
                {hasOverflowSynopsis && (
                  <button
                    onClick={() => setShowMoreSynopsis((prev) => !prev)}
                    className="text-brandprimary text-sm font-medium mt-1"
                  >
                    {showMoreSynopsis ? "Ver menos..." : "Ver mais..."}
                  </button>
                )}
              </div>

              {/* Comentário */}
              <div>
                <h2 className="text-brandmediumblue font-medium mb-1">
                  Meu comentário sobre
                </h2>
                <p
                  ref={commentRef}
                  className={`text-sm text-brandsteel leading-relaxed transition-all duration-300 ease-in-out ${
                    showMoreComment ? "" : "line-clamp-3"
                  }`}
                >
                  {review.comment}
                </p>
                {hasOverflowComment && (
                  <button
                    onClick={() => setShowMoreComment((prev) => !prev)}
                    className="text-brandprimary text-sm font-medium mt-1"
                  >
                    {showMoreComment ? "Ver menos..." : "Ver mais..."}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center mt-10">Nenhuma resenha selecionada.</p>
      )}
    </section>
  );
};

export default ReviewDetails;

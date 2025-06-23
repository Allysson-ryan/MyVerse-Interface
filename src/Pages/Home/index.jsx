import readBookImg from "../../assets/readBookImg.png";
import CustomCarousel from "../../components/CustomCarousel";
import SectionTitle from "../../components/SectionTitle";
import SubTitle from "../../components/SubTitle";
import { NotePencilIcon } from "@phosphor-icons/react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import {
  getLatestReviews,
  listReviews,
  listWishlist,
} from "../../Services/apiService";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "phosphor-react";
import { formatDateToBR } from "../../utils/formatedData";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

const Home = () => {
  const navigate = useNavigate();
  const [resenhasConsumindo, setResenhasConsumindo] = useState([]);
  const [ultimasResenhas, setUltimasResenhas] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const openSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchResenhasConsumindo = async () => {
      try {
        const todas = await listReviews();
        const consumindo = todas.filter(
          (review) => review.status === "Consumindo"
        );
        setResenhasConsumindo(consumindo);
      } catch (error) {
        openSnackbar("Erro ao buscar resenhas:", error.message);
      }
    };

    fetchResenhasConsumindo();
  }, []);

  useEffect(() => {
    const fetchUltimasResenhas = async () => {
      try {
        const data = await getLatestReviews();
        setUltimasResenhas(data);
      } catch (error) {
        openSnackbar("Erro ao carregar últimas resenhas:", error.message);
      }
    };

    fetchUltimasResenhas();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await listWishlist();
        const ultimos7 = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 7);
        setWishlistItems(ultimos7);
      } catch (error) {
        openSnackbar("Erro ao buscar lista de desejos:", error.message);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <div className="flex items-center justify-center flex-col md:flex-row">
        <img
          src={readBookImg}
          alt="readBookImg"
          className="max-sm:w-[12rem] sm:w-[15rem] md:w-[15rem]"
        />
        <h1 className="max-sm:text-[30px] max-sm:w-[60%] sm:text-[35px] sm:w-[70%] md:w-[26rem] lg:w-[26rem] xl:w-[26rem] font-bold text-center md:text-start lg:text-start xl:text-start mt-[10px] leading-[40px] text-branddeepblue">
          Guarde sua primeira impressão para sempre
        </h1>
      </div>
      <div className="flex justify-center flex-col p-6 max-sm:mt-[50px] sm:mt-[70px] mb-[50px]">
        <SectionTitle
          text="Estou consumindo"
          className="max-sm:text-[23px] sm:text-[25px] mb-[20px] pl-[30px]"
        />

        {resenhasConsumindo.length === 0 ? (
          <CustomCarousel>
            <div className="w-full px-[70px] flex flex-col items-center justify-center p-10 rounded-md">
              <h2 className="text-center text-[#1e1e1e] text-[18px] sm:text-[20px] font-semibold mb-4">
                Você não está consumindo
                <br className="sm:hidden" /> nada no momento
              </h2>
              <button
                onClick={() =>
                  navigate("/adicionar-resenha", {
                    state: { resenhaParaEditar: null },
                  })
                }
                className="flex items-center gap-2 bg-brandsteel text-white px-5 py-2 rounded-full text-[14px] sm:text-[15px] hover:opacity-90 transition"
              >
                <PlusCircle size={20} color="#ffffff" weight="fill" />
                Adicionar Resenha
              </button>
            </div>
          </CustomCarousel>
        ) : (
          <CustomCarousel>
            {resenhasConsumindo.map((resenha) => (
              <div
                key={resenha._id}
                className="w-full max-sm:h-[9rem] sm:h-[9rem] bg-brandlightgray flex items-center justify-center p-[10px] rounded-[10px] gap-[20px]"
              >
                <div>
                  <img
                    src={resenha.imageUrl}
                    alt={resenha.name}
                    className="max-sm:w-[7rem] sm:w-[6.5rem]"
                  />
                </div>
                <div className=" max-sm:w-[90%] max-sm:h-[9rem] sm:w-[90%] sm:h-[9rem] flex items-center flex-col pt-[10px] pb-[10px]">
                  <div className="w-full mt-[10px]">
                    <abbr title={resenha.name} className="no-underline w-full">
                      <SubTitle
                        text={resenha.name}
                        className="max-sm:text-[16px] sm:text-[17px] whitespace-nowrap overflow-hidden text-ellipsis block max-w-[150px]"
                      />
                    </abbr>
                    <div className="flex items-center justify-between pr-[10px]">
                      <h1
                        className="max-sm:h-[20px] sm:h-[20px] bg-brandbabyblue text-[12px] rounded-[15px] p-[7px] 
             max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis flex items-center"
                      >
                        <abbr
                          title={resenha.category?.name || ""}
                          className="block w-full overflow-hidden text-ellipsis whitespace-nowrap no-underline"
                        >
                          {resenha.category?.name}
                        </abbr>
                      </h1>

                      <h2 className="text-[13px]">
                        {resenha.totalPag
                          ? `Páginas: ${resenha.consumed}/${resenha.totalPag}`
                          : `Episódios: ${resenha.consumed}/${resenha.totalEp}`}
                      </h2>
                    </div>
                  </div>

                  <div className="mt-[25px]">
                    <button
                      onClick={() =>
                        navigate("/adicionar-resenha", {
                          state: { resenhaParaEditar: resenha },
                        })
                      }
                      className="bg-brandsteel flex items-center justify-center pr-[7px] pl-[7px] pt-[3px] pb-[3px] gap-[10px] rounded-[17px] text-[13px] text-white hover:bg-brandmediumblue"
                    >
                      <NotePencilIcon size={18} color="white" />
                      Editar resenha
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </CustomCarousel>
        )}
      </div>

      <div className="flex justify-center flex-col p-6 mt-[50px] mb-[50px]">
        <SectionTitle
          text="Minhas últimas resenhas"
          className="max-sm:text-[23px] sm:text-[23px] mb-[20px] pl-[30px]"
        />
        <div className="bg-brandiceblue w-full max-sm:h-[165px] sm:h-[190px] flex items-center justify-center p-[20px] rounded-[15px]">
          {ultimasResenhas.length === 0 ? (
            <CustomCarousel>
              <div className="w-full px-[70px] flex flex-col items-center justify-center p-10 rounded-md">
                <h2 className="text-center text-[#1e1e1e] text-[18px] sm:text-[20px] font-semibold mb-4">
                  Você não tem nenhuma
                  <br className="sm:hidden" /> resenha no momento
                </h2>
                <button
                  onClick={() =>
                    navigate("/adicionar-resenha", {
                      state: { resenhaParaEditar: null },
                    })
                  }
                  className="flex items-center gap-2 bg-brandsteel text-white px-5 py-2 rounded-full text-[14px] sm:text-[15px] hover:opacity-90 transition"
                >
                  <PlusCircle size={20} color="#ffffff" weight="fill" />
                  Adicionar Resenha
                </button>
              </div>
            </CustomCarousel>
          ) : (
            <CustomCarousel>
              {ultimasResenhas.map((resenha) => (
                <div
                  key={resenha._id}
                  className="max-sm:w-[95%] max-sm:min-h-[6.5rem] sm:w-[95%] sm:h-[9rem] bg-white flex items-center justify-center pr-[10px] p-[10px] rounded-[10px] gap-[13px]"
                >
                  <div className="max-sm:w-[7rem] sm:w-[7.5rem]">
                    <img
                      src={resenha.imageUrl}
                      alt={resenha.name}
                      className="w-full object-cover rounded-[5px]"
                    />
                  </div>

                  <div className="w-full h-full flex items-center flex-col pb-[10px]">
                    <div className="w-full mt-[10px]">
                      <SubTitle
                        text={resenha.name}
                        className="max-sm:text-[17px] sm:text-[18px] whitespace-nowrap overflow-hidden text-ellipsis block max-w-[150px]"
                      />
                      {resenha.startDate && (
                        <h2 className="text-[11.5px]">
                          {formatDateToBR(resenha.startDate)} -{" "}
                          {resenha.endDate ? (
                            formatDateToBR(resenha.endDate)
                          ) : resenha.status === "Abandonei" ? (
                            <span className="text-brandalert">Abandonei</span>
                          ) : null}
                        </h2>
                      )}
                    </div>

                    <div className="w-full h-full flex items-center justify-between pt-[10px] mt-[10px]">
                      <div>
                        <Stack spacing={1}>
                          <Rating
                            name="rating-read"
                            value={resenha.rating || 0}
                            precision={0.5}
                            readOnly
                          />
                        </Stack>
                      </div>
                      <h1
                        className="max-sm:h-[20px] sm:h-[20px] bg-brandbabyblue text-[12px] rounded-[15px] p-[7px] 
             max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis flex items-center"
                      >
                        <abbr
                          title={resenha.category?.name || ""}
                          className="block w-full overflow-hidden text-ellipsis whitespace-nowrap no-underline"
                        >
                          {resenha.category?.name}
                        </abbr>
                      </h1>
                    </div>
                  </div>
                </div>
              ))}
            </CustomCarousel>
          )}
        </div>
      </div>

      <SectionTitle
        text="Minha lista de desejos"
        className="max-sm:text-[23px] sm:text-[25px] mb-[20px] pl-[30px]"
      />

      {wishlistItems.length === 0 ? (
        <CustomCarousel>
          <div className="w-full px-[70px] flex flex-col items-center justify-center p-10 rounded-md">
            <h2 className="text-center text-[#1e1e1e] text-[18px] sm:text-[20px] font-semibold mb-4">
              Você não tem nada
              <br className="sm:hidden" /> em sua lista
            </h2>
            <button
              onClick={() =>
                navigate("/minha-lista", {
                  state: { resenhaParaEditar: null },
                })
              }
              className="flex items-center gap-2 bg-brandsteel text-white px-5 py-2 rounded-full text-[14px] sm:text-[15px] hover:opacity-90 transition"
            >
              <PlusCircle size={20} color="#ffffff" weight="fill" />
              Adicionar itens na lista
            </button>
          </div>
        </CustomCarousel>
      ) : (
        <CustomCarousel>
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="max-sm:w-[13rem] max-sm:h-[16rem] sm:w-[14rem] sm:h-[17rem] flex items-center flex-col p-[10px] rounded-[10px] border-[1px] border-brandsoftgray"
            >
              <div className="max-sm:w-[6rem] sm:w-[7rem]">
                <img src={item.imageUrl} alt={item.name} className="w-full" />
              </div>

              <div className="w-full h-full flex items-center justify-between flex-col mt-[10px]">
                <div className="w-full flex items-center justify-center">
                  <SubTitle
                    text={item.name}
                    className="max-sm:text-[18px] sm:text-[19px] text-center"
                  />
                </div>

                <div className="w-full flex items-center justify-between p-[10px]">
                  <h1 className="max-sm:w-[25%] sm:w-[27%] bg-brandbabyblue text-[12px] rounded-[15px] px-[10px] py-[2px] text-center">
                    {item.totalEp ? "Filme" : "Livro"}
                  </h1>
                  <h2 className="text-[13px]">
                    {item.totalEp
                      ? `Eps: ${item.totalEp}`
                      : `Páginas: ${item.totalPag}`}
                  </h2>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate("/minha-lista")}
            className="max-sm:w-[13rem] max-sm:h-[16rem] sm:w-[14rem] sm:h-[17rem] flex items-center justify-center rounded-[10px] border-[1px] border-brandsoftgray cursor-pointer hover:bg-brandiceblue hover:border-0"
          >
            <p className="">Ver Tudo</p>
          </button>
        </CustomCarousel>
      )}
    </>
  );
};

export default Home;

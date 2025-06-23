import { StackPlusIcon, TrashIcon } from "@phosphor-icons/react";
import CustomCarousel from "../../components/CustomCarousel";
import { FunnelSimple, NotePencil, PencilSimpleLine } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import SubTitle from "../../components/SubTitle";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  createCategory,
  deleteCategory,
  deleteReview,
  listAllCategories,
  listReviews,
  updateCategory,
} from "../../Services/apiService";
import { formatDateToBR } from "../../utils/formatedData";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Card = ({ title, value }) => (
  <div className="bg-brandsoftlavender w-[8rem] h-[8rem] md:w-[9rem] md:h-[9rem] p-[20px] rounded-[10px]">
    <p className="h-[50%] flex items-center justify-center text-brandsteel text-center text-[14px] md:text-[16px] leading-[18px] font-semibold">
      {title}
    </p>
    <h1 className="h-[50%] flex items-center justify-center text-branddeepblue text-center text-[29px] font-semibold">
      {value}
    </h1>
  </div>
);

const ResenhasPage = () => {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState("");
  const [status, setStatus] = useState("");
  const [nota, setNota] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [listCategories, setListCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [activePopoverId, setActivePopoverId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const handleClickDelete = (id) => {
    setSelectedReviewId(id);
    setOpenDialog(true);
  };

  const togglePopover = (id) => {
    setActivePopoverId((prev) => (prev === id ? null : id));
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [metrics, setMetrics] = useState({
    total: 0,
    consumindo: 0,
    finalizados: 0,
    abandonei: 0,
    favoritos: 0,
  });

  const cardsToRender = [
    { title: "Resenhas Totais", value: metrics.total },
    { title: "Estou Consumindo", value: metrics.consumindo },
    { title: "Finalizados", value: metrics.finalizados },
    { title: "Abandonei", value: metrics.abandonei },
    { title: "Favoritos", value: metrics.favoritos },
  ];

  const temFiltros = categoria || status || nota;

  const resetarFiltros = () => {
    setCategoria("");
    setStatus("");
    setNota("");
  };

  const openSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCloseModal = () => {
    close();
    setNomeCategoria("");
    setCategoriaEditando(null);
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Consumindo":
        return "text-brandprimary";
      case "Finalizado":
        return "text-brandsuccess";
      case "Abandonei":
        return "text-brandalert";
      default:
        return "text-black";
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await listAllCategories();
        setListCategories(data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Erro ao carregar categorias";
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
          `${errorMessage}`
        </Alert>;
      }
    }

    fetchCategories();
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const data = await listReviews();
      setReviews(data);

      const total = data.length;

      const consumindo = data.filter((r) => r.status === "Consumindo").length;
      const finalizados = data.filter((r) => r.status === "Finalizado").length;
      const abandonei = data.filter((r) => r.status === "Abandonei").length;
      const favoritos = data.filter((r) => r.favorite === true).length;

      setMetrics({ total, consumindo, finalizados, abandonei, favoritos });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao carregar métricas das resenhas.";
      openSnackbar(errorMessage, "error");
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    function aplicarFiltros() {
      let resultado = [...reviews];

      if (categoria) {
        resultado = resultado.filter(
          (review) => review.category?._id === categoria
        );
      }

      if (status) {
        const statusNormalizado =
          status === "lendo"
            ? "Consumindo"
            : status === "finalizado"
            ? "Finalizado"
            : status === "abandonado"
            ? "Abandonei"
            : "";

        resultado = resultado.filter(
          (review) => review.status === statusNormalizado
        );
      }

      if (nota) {
        if (nota === "favorito") {
          resultado = resultado.filter((review) => review.favorite === true);
        } else {
          resultado = resultado.filter(
            (review) => Number(review.rating) === Number(nota)
          );
        }
      }

      setFilteredReviews(resultado);
    }

    aplicarFiltros();
  }, [categoria, status, nota, reviews]);

  const handleSubmitCategoria = async (e) => {
    e.preventDefault();

    if (!nomeCategoria.trim()) return;

    try {
      if (categoriaEditando) {
        await updateCategory(categoriaEditando, { name: nomeCategoria });
        openSnackbar("Categoria atualizada com sucesso!", "success");
      } else {
        await createCategory({ name: nomeCategoria });
        openSnackbar("Categoria criada com sucesso!", "success");
      }

      setNomeCategoria("");
      setCategoriaEditando(null);
      const categoriasAtualizadas = await listAllCategories();
      setListCategories(categoriasAtualizadas);
    } catch (error) {
      openSnackbar(error.message, "error");
    }
  };

  const handleEditCategory = (category) => {
    setNomeCategoria(category.name);
    setCategoriaEditando(category._id);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      const categoriasAtualizadas = await listAllCategories();
      setListCategories(categoriasAtualizadas);
    } catch (error) {
      openSnackbar(error.message, "error");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteReview(selectedReviewId);
      setOpenDialog(false);
      await fetchReviews();
    } catch (error) {
      openSnackbar(error.message || "Erro ao deletar resenha.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReviewId(null);
  };

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

      <section className="px-4 py-8 w-full">
        {/* Desktop */}
        <div className="hidden sm:flex items-center justify-center gap-[20px]">
          {cardsToRender.map((card, index) => (
            <Card key={index} title={card.title} value={card.value} />
          ))}
        </div>

        {/* Mobile */}
        <div className="sm:hidden">
          <CustomCarousel>
            {cardsToRender.map((card, index) => (
              <Card key={index} title={card.title} value={card.value} />
            ))}
          </CustomCarousel>
        </div>

        {/* Filtros */}
        <div className="flex justify-between items-start max-sm:flex-col max-sm:items-center max-sm:gap-[20px] w-full gap-4 mt-[80px]">
          <button
            type="button"
            variant="default"
            onClick={open}
            className="hidden max-sm:flex items-center justify-center gap-2 bg-brandsteel text-white font-semibold text-sm mb-[35px] px-4 py-2 rounded-xl w-full max-w-[16rem] hover:cursor-pointer hover:bg-brandmediumblue"
          >
            <StackPlusIcon size={20} />
            <span className="text-sm">Editar Categorias</span>
          </button>

          <div className="w-full flex items-start flex-col gap-[5px]">
            <div className="flex items-center gap-4">
              <label className="text-[17px] font-semibold text-black ml-[10px]">
                Filtros{" "}
                <span className="inline-block">
                  <FunnelSimple size={20} />
                </span>
              </label>

              {temFiltros && (
                <button
                  onClick={resetarFiltros}
                  className="text-sm font-medium text-brandsteel underline ml-[50px]"
                >
                  Apagar todos os filtros
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-[7px] flex-wrap">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="px-4 py-1 rounded-full border text-sm border-brandsoftgray text-brandsoftgray"
              >
                <option value="">Categorias</option>
                {listCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-1 rounded-full border text-sm border-brandsoftgray text-brandsoftgray"
              >
                <option value="">Status</option>
                <option value="lendo">Consumindo</option>
                <option value="finalizado">Finalizado</option>
                <option value="abandonado">Abandonado</option>
              </select>

              <select
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="px-4 py-1 rounded-full border text-sm border-brandsoftgray text-brandsoftgray"
              >
                <option value="">Notas</option>
                <option value="1">1 Estrela</option>
                <option value="1.5">1.5 Estrela</option>
                <option value="2">2 Estrelas</option>
                <option value="2.5">2.5 Estrelas</option>
                <option value="3">3 Estrelas</option>
                <option value="3.5">3.5 Estrelas</option>
                <option value="4">4 Estrelas</option>
                <option value="4.5">4.5 Estrelas</option>
                <option value="5">5 Estrelas</option>
                <option value="favorito">❤️ Favoritos</option>
              </select>
            </div>
          </div>

          {/* Botão desktop */}
          <button
            type="button"
            variant="default"
            onClick={open}
            className="max-sm:hidden flex items-center justify-center gap-2 bg-brandsteel text-white font-semibold text-sm px-4 py-2 rounded-xl w-full max-w-[16rem] mt-[30px] hover:cursor-pointer hover:bg-brandmediumblue"
          >
            <StackPlusIcon size={20} />
            <span className="text-sm">Editar Categorias</span>
          </button>
        </div>

        <div className="w-full grid max-sm:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-[5px] mt-[50px] gap-[10px]">
          {/* listar e editar categoria */}
          <Modal opened={opened} onClose={handleCloseModal} centered>
            <div className="flex items-center justify-center mb-[10px]">
              <h1 className="text-[23px] text-center text-brandprimary font-medium">
                Editar Categorias
              </h1>
            </div>

            <div className="px-[20px] pb-[10px]">
              <h2 className="text-[16px] font-semibold text-branddeepblue mb-3">
                Todas as categorias
              </h2>

              <div className="flex flex-wrap gap-3">
                {listCategories.length === 0 ? (
                  <p className="text-sm text-gray-500 ">
                    Você não possui categorias
                  </p>
                ) : (
                  listCategories.map((category) => (
                    <div
                      key={category._id}
                      className="bg-[#ededed] text-black text-sm rounded-[6px] px-3 py-1 flex items-center gap-2"
                    >
                      <span>{category.name}</span>
                      <button
                        type="button"
                        onClick={() => handleEditCategory(category)}
                        className="hover:opacity-80"
                      >
                        <NotePencil size={16} color="#1e396d" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(category._id)}
                        className="hover:opacity-80"
                      >
                        <TrashIcon size={16} color="#c64141" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <form
              className="space-y-6 p-[20px] pt-0 mt-[25px]"
              onSubmit={handleSubmitCategoria}
            >
              <div>
                <h2 className="text-[16px] font-semibold text-branddeepblue mb-3">
                  {categoriaEditando
                    ? "Editar categoria"
                    : "Adicionar nova categoria"}
                </h2>

                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-brandsteel mb-1 mt-[10px]"
                >
                  Nome da categoria
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={nomeCategoria}
                  onChange={(e) => setNomeCategoria(e.target.value)}
                  placeholder="digite o nome da categoria"
                  className="block w-full border border-brandsteel rounded-md py-2 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-brandprimary"
                />
              </div>

              <div className="flex justify-center mb-[2rem]">
                <button
                  type="submit"
                  className="w-40 inline-flex items-center justify-center py-2.5 rounded-[10px] gap-[10px] bg-brandsteel text-white font-medium hover:bg-brandmediumblue transition-colors duration-200"
                >
                  {categoriaEditando ? "Atualizar" : "Adicionar"}
                </button>
              </div>
            </form>
          </Modal>

          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div
                key={review._id}
                onClick={() => navigate("/detalhes", { state: { review } })}
                className="cursor-pointer transition-transform duration-300 hover:scale-105 
                max-sm:w-[100%] max-sm:min-h-[7rem] sm:w-[100%] sm:min-h-[8rem] 
                bg-brandlightgray flex items-center justify-center 
                max-sm:flex-col sm:flex-col md:flex-row pr-[10px] p-[10px] 
                rounded-[10px] gap-[13px]"
              >
                <div className=" max-sm:w-[7rem] sm:w-[6rem] md:w-[7.5rem] mt-[10px] md:mt-0">
                  <img
                    src={review.imageUrl}
                    alt={review.name}
                    className="w-full rounded-[5px]"
                  />
                </div>
                <div className="w-full h-full flex items-center justify-center flex-col pb-[10px]">
                  <div className="w-full mt-[10px]">
                    <div className="w-full flex items-center justify-between gap-[5px]">
                      <abbr title={review.name} className="no-underline w-full">
                        <SubTitle
                          text={review.name}
                          className="custom-subtitle-462px custom-subtitle-525px custom-subtitle-635px custom-subtitle-685px max-sm:text-[20px] sm:text-[18px] whitespace-nowrap overflow-hidden text-ellipsis block max-w-[150px]"
                        />
                      </abbr>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePopover(review._id);
                          }}
                        >
                          <NotePencil
                            size={18}
                            className="hover:text-brandsteel custom-buttonEdit-462px custom-buttonEdit-525px custom-buttonEdit-635px max-sm:w-[25px] max-sm:h-[25px] md:w-[25px] md:h-[25px] cursor-pointer"
                          />
                        </button>

                        {activePopoverId === review._id && (
                          <div className="absolute top-[120%] right-0 bg-brandsteel rounded-lg shadow-lg z-50 px-6 py-5 w-[140px] flex flex-col items-center gap-2">
                            <div className="absolute -top-1.5 right-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[6px] border-b-brandsteel"></div>

                            {/* Botão Editar */}
                            <button
                              className="w-full flex items-center gap-2 px-2 py-1 rounded bg-white text-brandsteel hover:opacity-90 transition mb-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/adicionar-resenha", {
                                  state: { review },
                                });
                                setActivePopoverId(null);
                              }}
                            >
                              <PencilSimpleLine size={16} />
                              <span className="text-xs font-semibold">
                                Editar
                              </span>
                            </button>

                            {/* Botão Apagar */}
                            <button
                              className="w-full flex items-center gap-2 px-2 py-1 rounded text-white hover:bg-[#5c6786] transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClickDelete(review._id);
                              }}
                            >
                              <TrashIcon size={16} />
                              <span className="text-xs font-semibold">
                                Apagar
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Modal de confirmação */}
                    </div>

                    {review.startDate && (
                      <h2 className="text-[11.5px] custom-h2-462px custom-h2-525px custom-h2-635px max-sm:text-[13px] sm:text-[12px] md:text-[13px]">
                        {formatDateToBR(review.startDate)} -{" "}
                        {review.endDate ? (
                          formatDateToBR(review.endDate)
                        ) : review.status === "Abandonei" ? (
                          <span className="text-[12px] ">Sem Data</span>
                        ) : null}
                      </h2>
                    )}

                    <h2 className="custom-h2-462px custom-h2-525px custom-h2-635px max-sm:text-[13px] sm:text-[12px] md:text-[13px]">
                      {review.totalPag
                        ? `Páginas: ${review.consumed}/${review.totalPag}`
                        : `Episódios: ${review.consumed}/${review.totalEp}`}
                    </h2>
                    <h2
                      className={`${getStatusColorClass(
                        review.status
                      )} custom-status-462px custom-status-525px custom-status-635px max-sm:text-[14px] sm:text-[14px]`}
                    >
                      {review.status}
                    </h2>
                  </div>

                  <div className="custom-div-462px max-sm:flex-col-reverse sm:flex-col-reverse md:flex-row w-full h-full flex items-center justify-between pt-[10px] mt-[10px] gap-[10px]">
                    <div className="flex items-center gap-[5px]">
                      <Stack spacing={1}>
                        <Rating
                          name={`rating-${review._id}`}
                          value={review.rating}
                          precision={0.5}
                          readOnly
                        />
                      </Stack>
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
                    <h1
                      className="max-sm:h-[20px] sm:h-[20px] bg-brandbabyblue text-[12px] rounded-[15px] p-[7px] 
                      max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis flex items-center"
                    >
                      <abbr
                        title={review.category?.name || ""}
                        className="block w-full overflow-hidden text-ellipsis whitespace-nowrap no-underline"
                      >
                        {review.category?.name}
                      </abbr>
                    </h1>
                  </div>
                  {openDialog && (
                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                      <DialogTitle>Confirmar exclusão</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Tem certeza que deseja excluir esta resenha? Essa ação
                          não pode ser desfeita.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseDialog();
                          }}
                          color="primary"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmDelete();
                          }}
                          color="error"
                          variant="contained"
                        >
                          Excluir
                        </Button>
                      </DialogActions>
                    </Dialog>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-brandsteel font-bold text-center w-full mt-3 ml-5">
              Nenhuma resenha encontrada
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default ResenhasPage;

import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  createReview,
  listAllCategories,
  updateReview,
} from "../../Services/apiService";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { Snackbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddReview() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const location = useLocation();
  const editingReview =
    location.state?.review || location.state?.resenhaParaEditar || null;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    category: "",
    status: "",
    type: "",
    totalEpisodes: "",
    watchedEpisodes: "",
    totalPag: "",
    readPages: "",
    startDate: "",
    endDate: "",
    rating: 0,
    favorit: 0,
    synopsis: "",
    comment: "",
  });

  useEffect(() => {
    if (editingReview) {
      setFormData({
        name: editingReview.name || "",
        imageUrl: editingReview.imageUrl || "",
        category: editingReview.category?._id || "",
        status: editingReview.status || "",
        type: editingReview.totalEp ? "assistir" : "ler",
        totalEpisodes: editingReview.totalEp?.toString() || "",
        watchedEpisodes: editingReview.totalEp
          ? editingReview.consumed?.toString() || ""
          : "",
        totalPag: editingReview.totalPag?.toString() || "",
        readPages: editingReview.totalPag
          ? editingReview.consumed?.toString() || ""
          : "",
        startDate: editingReview.startDate
          ? new Date(editingReview.startDate).toISOString().split("T")[0]
          : "",
        endDate: editingReview.endDate
          ? new Date(editingReview.endDate).toISOString().split("T")[0]
          : "",
        rating: editingReview.rating || 0,
        favorit: editingReview.favorite ? 1 : 0,
        synopsis: editingReview.synopsis || "",
        comment: editingReview.comment || "",
      });
    }
  }, [editingReview]);

  const [errors, setErrors] = useState({
    name: "",
    imageUrl: "",
    category: "",
    status: "",
    type: "",
    totalEpisodes: "",
    watchedEpisodes: "",
    startDate: "",
    endDate: "",
    rating: "",
    favorit: "",
    synopsis: "",
    comment: "",
  });

  function formatReviewData(data) {
    return {
      name: data.name,
      imageUrl: data.imageUrl,
      category: data.category,
      status: data.status,
      totalEp:
        data.type === "assistir" ? Number(data.totalEpisodes) : undefined,
      totalPag: data.type === "ler" ? Number(data.totalPag) : undefined,
      consumed:
        data.type === "assistir"
          ? Number(data.watchedEpisodes || 0)
          : Number(data.readPages || 0),
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      rating: Number(data.rating),
      favorite: data.favorit === 1,
      synopsis: data.synopsis,
      comment: data.comment,
    };
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleRatingChange(e, newValue) {
    setFormData((prev) => ({ ...prev, rating: newValue }));
    setErrors((prev) => ({ ...prev, rating: "" }));
  }

  function handleFavoriteChange(event, newValue) {
    setFormData((prev) => ({ ...prev, favorit: newValue }));
    setErrors((prev) => ({ ...prev, favorit: "" }));
  }

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  function validateAll() {
    let tempErrors = { ...errors };
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "O nome é obrigatório.";
      isValid = false;
    }
    if (!formData.imageUrl.trim()) {
      tempErrors.imageUrl = "O link da imagem é obrigatório.";
      isValid = false;
    }
    if (!formData.category.trim()) {
      tempErrors.category = "A categoria é obrigatória.";
      isValid = false;
    }
    if (!formData.status.trim()) {
      tempErrors.status = "O status é obrigatório.";
      isValid = false;
    }
    if (!formData.type.trim()) {
      tempErrors.type = "O tipo de mídia é obrigatório.";
      isValid = false;
    }

    if (formData.type === "assistir") {
      if (!formData.totalEpisodes.trim()) {
        tempErrors.totalEpisodes = "Insira o total de episódios.";
        isValid = false;
      }
      if (!formData.watchedEpisodes.trim()) {
        tempErrors.watchedEpisodes = "Insira episódios assistidos.";
        isValid = false;
      }
    }

    if (formData.type === "ler") {
      if (!formData.totalPag.trim()) {
        tempErrors.totalPag = "Insira o total de páginas.";
        isValid = false;
      }
      if (!formData.readPages.trim()) {
        tempErrors.readPages = "Insira páginas lidas.";
        isValid = false;
      }
    }

    if (!formData.startDate.trim()) {
      tempErrors.startDate = "Informe a data de início.";
      isValid = false;
    }
    if (formData.status === "Finalizado") {
      if (!formData.endDate.trim()) {
        tempErrors.endDate = "Informe a data de término.";
        isValid = false;
      }
    }

    if (formData.rating <= 0) {
      tempErrors.rating = "Dê uma nota (1 a 5).";
      isValid = false;
    }
    if (!formData.synopsis.trim()) {
      tempErrors.synopsis = "A sinopse não pode ficar vazia.";
      isValid = false;
    }
    if (!formData.comment.trim()) {
      tempErrors.comment = "Deixe seu comentário.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const isFormValid = validateAll();
    if (!isFormValid) return;

    const reviewData = formatReviewData(formData);

    try {
      if (editingReview) {
        await updateReview(editingReview._id, reviewData);
        setSnackbar({
          open: true,
          message: "Resenha atualizada com sucesso!",
          severity: "success",
        });

        setTimeout(() => {
          navigate("/resenhas");
        }, 2000);
      } else {
        await createReview(reviewData);
        setSnackbar({
          open: true,
          message: "Resenha cadastrada com sucesso!",
          severity: "success",
        });
      }

      setFormData({
        name: "",
        imageUrl: "",
        category: "",
        status: "",
        type: "",
        totalEpisodes: "",
        watchedEpisodes: "",
        totalPag: "",
        readPages: "",
        startDate: "",
        endDate: "",
        rating: 0,
        favorit: 0,
        synopsis: "",
        comment: "",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (editingReview
          ? "Erro ao atualizar resenha."
          : "Erro ao cadastrar resenha.");
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  }

  const isEndDateDisabled =
    formData.status === "Consumindo" || formData.status === "Abandonei";

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await listAllCategories();
        setCategories(data);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white mb-[50px]">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // opcional
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
      <div className="bg-brandbabyblue w-full max-w-2xl rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-center text-2xl font-semibold text-brandprimary mb-6">
          Adicione uma resenha
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
            {/** Campo: Nome */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-branddeepblue mb-1"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Título da obra"
                className={`
                  block w-full
                  border 
                  rounded-md
                  py-2 px-3
                  text-sm text-black
                  placeholder:italic placeholder:text-brandsteel
                  focus:outline-none focus:ring-2 focus:ring-brandprimary 
                  ${errors.name ? "border-brandalert" : "border-brandsteel"}
                `}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-brandalert">{errors.name}</p>
              )}
            </div>

            {/** Campo: Link da imagem */}
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-branddeepblue mb-1"
              >
                Link da imagem
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://exemplo.com/capa.jpg"
                className={`
                  block w-full
                  border 
                  rounded-md
                  py-2 px-3
                  text-sm text-black
                  placeholder:italic placeholder:text-brandsteel
                  focus:outline-none focus:ring-2 focus:ring-brandprimary 
                  ${errors.imageUrl ? "border-brandalert" : "border-brandsteel"}
                `}
              />
              {errors.imageUrl && (
                <p className="mt-1 text-xs text-brandalert">
                  {errors.imageUrl}
                </p>
              )}
            </div>

            {/** Campo: Categoria */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-branddeepblue mb-1"
              >
                Categoria
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`
                block w-full
                border 
                border-black
                rounded-md
                py-2 px-3
                text-sm text-branddeepblue
                focus:outline-none focus:ring-2 focus:ring-brandprimary 
                ${errors.category ? "border-brandalert" : "border-brandsteel"}
              `}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className="mt-1 text-xs text-brandalert">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Campo: Status */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-branddeepblue mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`
                  block w-full
                  border 
                  rounded-md
                  py-2 px-3
                  text-sm text-branddeepblue
                  ${errors.status ? "border-brandalert" : "border-brandsteel"}
                `}
              >
                <option value="">Selecione um status</option>
                <option value="Consumindo">Consumindo</option>
                <option value="Abandonei">Abandonei</option>
                <option value="Finalizado">Finalizado</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-xs text-brandalert">{errors.status}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-branddeepblue mb-1"
              >
                Tipo da mídia
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`
                  block w-full
                  border 
                  rounded-md
                  py-2 px-3
                  text-sm text-branddeepblue
                  ${errors.type ? "border-brandalert" : "border-brandsteel"}
                `}
              >
                <option value="">Selecione um tipo</option>
                <option value="assistir">Assistir (filme, série...)</option>
                <option value="ler">Ler (livro, mangá...)</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-brandalert">{errors.type}</p>
              )}
            </div>

            {/** Campo: episódios / páginas totais */}
            {formData.type === "assistir" && (
              <>
                {/* episódios totais */}
                <div>
                  <label
                    htmlFor="totalEpisodes"
                    className="block text-sm font-medium text-branddeepblue mb-1"
                  >
                    Episódios totais
                  </label>
                  <input
                    type="number"
                    id="totalEpisodes"
                    name="totalEpisodes"
                    value={formData.totalEpisodes}
                    onChange={handleChange}
                    placeholder="Ex: 12"
                    className={`block w-full border rounded-md py-2 px-3 appearance-none [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none text-sm text-black placeholder:text-brandsteel focus:outline-none focus:ring-2 focus:ring-brandprimary ${
                    errors.totalEpisodes
                      ? "border-brandalert"
                      : "border-brandsteel"
                  }`}
                  />
                  {errors.totalEpisodes && (
                    <p className="mt-1 text-xs text-brandalert">
                      {errors.totalEpisodes}
                    </p>
                  )}
                </div>

                {/* episódios assistidos */}
                <div>
                  <label
                    htmlFor="watchedEpisodes"
                    className="block text-sm font-medium text-branddeepblue mb-1"
                  >
                    Episódios assistidos
                  </label>
                  <input
                    type="number"
                    id="watchedEpisodes"
                    name="watchedEpisodes"
                    value={formData.watchedEpisodes}
                    onChange={handleChange}
                    placeholder="Ex: 5"
                    className={`block w-full border rounded-md py-2 px-3 appearance-none [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none text-sm text-black placeholder:text-brandsteel focus:outline-none focus:ring-2 focus:ring-brandprimary ${
                    errors.watchedEpisodes
                      ? "border-brandalert"
                      : "border-brandsteel"
                  }`}
                  />
                  {errors.watchedEpisodes && (
                    <p className="mt-1 text-xs text-brandalert">
                      {errors.watchedEpisodes}
                    </p>
                  )}
                </div>
              </>
            )}

            {formData.type === "ler" && (
              <>
                {/* páginas totais */}
                <div>
                  <label
                    htmlFor="totalPag"
                    className="block text-sm font-medium text-branddeepblue mb-1"
                  >
                    Páginas totais
                  </label>
                  <input
                    type="number"
                    id="totalPag"
                    name="totalPag"
                    value={formData.totalPag}
                    onChange={handleChange}
                    placeholder="Ex: 300"
                    className={`block w-full border rounded-md py-2 px-3 [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none text-sm text-black placeholder:text-brandsteel focus:outline-none focus:ring-2 focus:ring-brandprimary ${
                    errors.totalPag ? "border-brandalert" : "border-brandsteel"
                  }`}
                  />
                  {errors.totalPag && (
                    <p className="mt-1 text-xs text-brandalert">
                      {errors.totalPag}
                    </p>
                  )}
                </div>

                {/* páginas lidas */}
                <div>
                  <label
                    htmlFor="readPages"
                    className="block text-sm font-medium text-branddeepblue mb-1"
                  >
                    Páginas lidas
                  </label>
                  <input
                    type="number"
                    id="readPages"
                    name="readPages"
                    value={formData.readPages || ""}
                    onChange={handleChange}
                    placeholder="Ex: 150"
                    className={`block w-full border rounded-md py-2 px-3 [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none text-sm text-black placeholder:text-brandsteel focus:outline-none focus:ring-2 focus:ring-brandprimary ${
                    errors.readPages ? "border-brandalert" : "border-brandsteel"
                  }`}
                  />
                  {errors.readPages && (
                    <p className="mt-1 text-xs text-brandalert">
                      {errors.readPages}
                    </p>
                  )}
                </div>
              </>
            )}

            {/** Campo: Data que comecei */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-branddeepblue mb-1"
              >
                Data que comecei
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`
                  block w-full
                  border 
                  rounded-md
                  py-2 px-3
                  text-sm text-branddeepblue
                  placeholder:text-brandsteel
                  focus:outline-none focus:ring-2 focus:ring-brandprimary 
                  ${
                    errors.startDate ? "border-brandalert" : "border-brandsteel"
                  }
                `}
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-brandalert">
                  {errors.startDate}
                </p>
              )}
            </div>

            {/** Campo: Data que terminei */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-branddeepblue mb-1"
              >
                Data que terminei
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={isEndDateDisabled}
                className={`
                  block w-full
                  ${isEndDateDisabled ? "bg-brandlightgray" : ""}
                  ${
                    isEndDateDisabled ? "cursor-not-allowed " : "cursor-pointer"
                  }
                  ${isEndDateDisabled ? "border-0" : "border-brandsteel"}
                  border 
                  rounded-md
                  py-2 px-3
                  text-sm text-branddeepblue
                  focus:outline-none focus:ring-2 focus:ring-brandprimary 
                  ${errors.endDate ? "border-brandalert" : "border-brandsteel"}
                `}
              />
              {errors.endDate && (
                <p className="mt-1 text-xs text-brandalert">{errors.endDate}</p>
              )}
            </div>

            {/** Campo: Nota (Rating do MUI) */}
            <div className="flex flex-col">
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-branddeepblue mb-1"
              >
                Nota
              </label>
              <div className="flex items-center">
                <Stack spacing={1}>
                  <Rating
                    name="half-rating"
                    value={formData.rating}
                    precision={0.5}
                    onChange={handleRatingChange}
                    size="large"
                    sx={{
                      "& .MuiRating-iconFilled": { color: "#e5c828" },
                      "& .MuiRating-iconHover": { color: "#FFC107" },
                    }}
                  />
                </Stack>
                <Stack spacing={1}>
                  <Rating
                    name="favorite"
                    value={formData.favorit}
                    max={1}
                    onChange={handleFavoriteChange}
                    icon={<FavoriteIcon fontSize="inherit" />}
                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "#f44336",
                      },
                      "& .MuiRating-iconHover": {
                        color: "#ff7961",
                      },
                    }}
                  />
                </Stack>
              </div>
              {errors.rating && (
                <p className="mt-1 text-xs text-brandalert">{errors.rating}</p>
              )}
            </div>
          </div>

          {/** Campo: Sinopse */}
          <div>
            <label
              htmlFor="synopsis"
              className="block text-sm font-medium text-branddeepblue mb-1"
            >
              Sinopse
            </label>
            <textarea
              id="synopsis"
              name="synopsis"
              value={formData.synopsis}
              onChange={handleChange}
              rows={3}
              placeholder="Breve sinopse da obra..."
              className={`
                block w-full
                border 
                rounded-md
                py-2 px-3
                text-sm text-black
                resize-none
                placeholder:italic placeholder:text-brandsteel
                focus:outline-none focus:ring-2 focus:ring-brandprimary 
                ${errors.synopsis ? "border-brandalert" : "border-brandsteel"}
              `}
            />
            {errors.synopsis && (
              <p className="mt-1 text-xs text-brandalert">{errors.synopsis}</p>
            )}
          </div>

          {/** Campo: Meu comentário */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-branddeepblue mb-1"
            >
              Meu comentário
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={3}
              placeholder="Escreva suas impressões..."
              className={`
                block w-full
                border 
                rounded-md
                py-2 px-3
                text-sm text-black
                resize-none
                placeholder:italic placeholder:text-brandsteel
                focus:outline-none focus:ring-2 focus:ring-brandprimary 
                ${errors.comment ? "border-brandalert" : "border-brandsteel"}
              `}
            />
            {errors.comment && (
              <p className="mt-1 text-xs text-brandalert">{errors.comment}</p>
            )}
          </div>

          {/** Botão de Adicionar */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="
              w-40
              inline-flex items-center justify-center
              py-2.5
              rounded-[10px]
              bg-branddeepblue
              text-white font-medium
              hover:bg-brandmediumblue 
              transition-colors duration-200
            "
            >
              {editingReview ? "Editar" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Table, Checkbox } from "@mantine/core";
import {
  MagnifyingGlass,
  NotePencil,
  PencilSimpleLine,
  PlusCircle,
} from "phosphor-react";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import {
  createWishlist,
  deleteWishlist,
  listAllCategories,
  listWishlist,
  updateWishlist,
} from "../../Services/apiService";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
import { FunnelSimpleXIcon, TrashIcon } from "@phosphor-icons/react";

export default function MyList() {
  const [searchText, setSearchText] = useState("");
  const [selection, setSelection] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [errors, setErrors] = useState({});
  const [listCategories, setListCategories] = useState([]);
  const [selectedWishlistId, setSelectedWishlist] = useState(null);
  const [activePopoverId, setActivePopoverId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [wishlistData, setWishlistData] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    category: "",
    type: "",
    totalEp: "",
    totalPag: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nome é obrigatório";
    if (!formData.imageUrl) newErrors.imageUrl = "Link da imagem é obrigatório";
    if (!formData.category) newErrors.category = "Categoria é obrigatória";
    if (!formData.type) newErrors.type = "Tipo de mídia é obrigatório";
    if (formData.type === "assistir" && !formData.totalEp) {
      newErrors.totalEp = "Total de episódios é obrigatório";
    }
    if (formData.type === "ler" && !formData.totalPag) {
      newErrors.totalPag = "Total de páginas é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  const clearForm = () => {
    setFormData({
      name: "",
      imageUrl: "",
      category: "",
      type: "",
      totalEp: "",
      totalPag: "",
    });
    setErrors({});
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleClickDelete = (id) => {
    setSelectedWishlist(id);
    setActivePopoverId(null);
    setOpenDialog(true);
  };

  const togglePopover = (id) => {
    setActivePopoverId((prev) => (prev === id ? null : id));
  };

  const openSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseModal = () => {
    close();
    clearForm();
    setSelectedWishlist(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteWishlist(selectedWishlistId);
      const data = await listWishlist();
      setWishlistData(data);
      setOpenDialog(false);
      openSnackbar("Item removido da lista com sucesso!");
    } catch (error) {
      openSnackbar(error.message || "Erro ao deletar item da lista.", "error");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWishlist(null);
  };

  const filteredRows = useMemo(() => {
    return wishlistData.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const categoryId = item.category?._id || item.category;

      const matchesCategory = selectedCategory
        ? categoryId === selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory, wishlistData]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const toggleRow = (id) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

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

  const fetchWishlist = useCallback(async () => {
    try {
      const data = await listWishlist();
      const normalized = data.map((item) => ({ ...item, id: item._id }));
      setWishlistData(normalized);
    } catch (error) {
      openSnackbar(error.message, "error");
    }
  }, [openSnackbar]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        totalEp:
          formData.type === "assistir" ? Number(formData.totalEp) : undefined,
        totalPag:
          formData.type === "ler" ? Number(formData.totalPag) : undefined,
      };

      if (selectedWishlistId) {
        await updateWishlist(selectedWishlistId, payload);
        openSnackbar("Item atualizado com sucesso!");
      } else {
        await createWishlist(payload);
        openSnackbar("Item adicionado à lista de desejos!");
      }

      await fetchWishlist();

      clearForm();
      setSelectedWishlist(null);
      close();
    } catch (error) {
      openSnackbar(error.message, "Erro ao salvar item na lista de desejos.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center bg-white">
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
        <div className="w-full max-w-5xl px-4 pt-6">
          <div className="grid gap-3 mb-4 max-sm:grid-cols-2 max-sm:grid-rows-2 sm:grid-cols-3 sm:grid-rows-1 sm:items-center">
            <button
              type="button"
              variant="default"
              onClick={() => {
                clearForm();
                setSelectedWishlist(null);
                open();
              }}
              className="flex flex-1 max-sm:row-start-2 max-sm:col-start-1 sm:row-auto sm:col-start-auto sm:flex-none max-sm:order-2 sm:oredr-1 items-center justify-center border border-brandsoftgray rounded-md py-2 px-3 text-sm text-brandsoftgray hover:bg-brandiceblue transition-colors duration-200"
            >
              <PlusCircle size={23} />
              <span className="ml-2">Adicionar à lista</span>
            </button>

            <div className="relative w-full max-sm:col-span-2 sm:col-span-1 max-sm:order-1 sm:order-2">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Pesquisar"
                className="w-full border border-brandsoftgray rounded-md py-2 pl-10 pr-3 text-sm text-black placeholder:italic placeholder:text-brandsoftgray focus:outline-none focus:ring-2 focus:ring-brandprimary"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlass size={23} color="#979292" />
              </div>
            </div>

            {/* Select "Filtrar por categoria" */}
            <div className="relative flex items-center max-sm:row-start-2 max-sm:col-start-2 sm:col-span-1 sm:order-3">
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full border border-brandsoftgray rounded-md py-2 px-3 text-sm text-brandsoftgray"
              >
                <option value="">Filtrar por categoria</option>
                {listCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory("")}
                  className="absolute right-2 mr-[20px]"
                  title="Limpar filtro"
                >
                  <FunnelSimpleXIcon size={18} color="#c64141" />
                </button>
              )}
            </div>
          </div>

          <div className="bg-brandiceblue rounded-xl border border-brandlightgray max-h-[450px] overflow-y-auto ">
            <div className="overflow-x-auto">
              <Table highlightOnHover striped withBorder withColumnBorders>
                <thead className="bg-brandiceblue font-semibold text-black text-sm">
                  <tr>
                    <th className="py-3 px-4"></th>
                    <th className="py-3 px-4"></th>
                    <th className="py-3 px-4 text-branddeepblue">Nome</th>
                    <th className="py-3 px-4 text-branddeepblue">Categoria</th>
                    <th className="py-3 px-4 text-branddeepblue">Episódios</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-[15px] text-brandsteel font-bold"
                      >
                        Nada foi encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row._id}>
                        <td className="py-3 px-4">
                          <Checkbox
                            checked={selection.includes(row._id)}
                            onChange={() => toggleRow(row._id)}
                          />
                        </td>
                        <td className="py-2 px-4 text-center">
                          <div className="relative inline-block">
                            <NotePencil
                              size={25}
                              onClick={() => togglePopover(row._id)}
                              className="text-brandsteel cursor-pointer hover:text-brandprimary"
                            />

                            {activePopoverId === row._id && (
                              <div className="absolute top-8 right-0 z-50 bg-brandsteel rounded-lg shadow-lg px-4 py-3 w-[140px] flex flex-col items-center gap-2">
                                <div className="absolute -top-2 right-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[6px] border-b-brandsteel" />

                                <button
                                  className="w-full flex items-center gap-2 px-2 py-1 rounded bg-white text-brandsteel hover:opacity-90 transition"
                                  onClick={() => {
                                    setFormData({
                                      name: row.name,
                                      imageUrl: row.imageUrl,
                                      category: row.category.name,
                                      type: row.totalEp ? "assistir" : "ler",
                                      totalEp: row.totalEp || "",
                                      totalPag: row.totalPag || "",
                                    });
                                    setSelectedWishlist(row._id);
                                    setActivePopoverId(null);
                                    open();
                                  }}
                                >
                                  <PencilSimpleLine size={16} />
                                  <span className="text-xs font-semibold">
                                    Editar
                                  </span>
                                </button>

                                <button
                                  className="w-full flex items-center gap-2 px-2 py-1 rounded text-white hover:bg-[#5c6786] transition"
                                  onClick={() => handleClickDelete(row._id)}
                                >
                                  <TrashIcon size={16} />
                                  <span className="text-xs font-semibold">
                                    Apagar
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-2 px-4 text-brandsteel text-center">
                          {row.name}
                        </td>
                        <td className="py-2 px-4 text-brandsteel text-center">
                          {row.category?.name || "-"}
                        </td>

                        <td className="py-2 px-4 text-brandsteel text-center">
                          {row.totalEp
                            ? `${row.totalEp} episódios`
                            : row.totalPag
                            ? `${row.totalPag} páginas`
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </div>

          <div className="mt-2 text-sm font-medium text-black mb-[40px]">
            Total: {filteredRows.length}
          </div>
        </div>
      </div>

      <Modal opened={opened} onClose={handleCloseModal} centered>
        <div className="flex items-center justify-center mb-[10px]">
          <h1 className="text-[23px] text-brandprimary font-medium">
            Adicionar a lista
          </h1>
        </div>
        <form className="space-y-6 p-[20px]" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-brandsteel mb-1"
            >
              Nome da obra
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="digite o nome"
              value={formData.name}
              onChange={handleChange}
              className={`
                  block w-full
                  border 
                  rounded-md
                  py-2 px-3
                  text-sm text-black
                  focus:outline-none focus:ring-2 focus:ring-brandprimary 
                  "border-brandsteel"
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
              className="block text-sm font-medium text-brandsteel mb-1"
            >
              Link da imagem
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://exemplo.com"
              className={`
                  block w-full
                  border 
                  rounded-md
                  py-2 px-3
                  text-sm text-black
                  placeholder:italic placeholder:text-brandsoftgray
                  focus:outline-none focus:ring-2 focus:ring-brandprimary 
                  "border-brandsteel"
                `}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-xs text-brandalert">{errors.imageUrl}</p>
            )}
          </div>

          {/** Campo: Categoria */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-brandsteel mb-1"
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
                  text-sm text-black
                  focus:outline-none focus:ring-2 focus:ring-brandprimary 
                  "border-brandsteel"}
                `}
            >
              <option value="">Selecione uma categoria</option>
              {listCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-brandalert">{errors.category}</p>
            )}
          </div>

          {/* Tipo: assistir ou ler */}
          <div>
            <label className="block text-sm font-medium text-brandsteel mb-1">
              Tipo de mídia
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="block w-full border rounded-md py-2 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-brandprimary border-brandsteel"
            >
              <option value="" className="text-brandsoftgray ">
                Selecione um tipo
              </option>
              <option value="assistir">Assistir</option>
              <option value="ler">Ler</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-brandalert">{errors.type}</p>
            )}
          </div>

          {/* Episódios ou Páginas (condicional) */}
          {formData.type === "assistir" && (
            <div>
              <label
                htmlFor="totalEp"
                className="block text-sm font-medium text-brandsteel mb-1"
              >
                Total de episódios
              </label>
              <input
                type="number"
                id="totalEp"
                name="totalEp"
                placeholder="ex: 3"
                value={formData.totalEp}
                onChange={handleChange}
                className="placeholder:text-brandsoftgray [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none block w-full border rounded-md py-2 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-brandprimary border-brandsteel"
              />
              {errors.totalEp && (
                <p className="mt-1 text-xs text-brandalert">{errors.totalEp}</p>
              )}
            </div>
          )}

          {formData.type === "ler" && (
            <div>
              <label
                htmlFor="totalPag"
                className="block text-sm font-medium text-brandsteel mb-1"
              >
                Total de páginas
              </label>
              <input
                type="number"
                id="totalPag"
                name="totalPag"
                placeholder="ex: 3"
                value={formData.totalPag}
                onChange={handleChange}
                className="placeholder:text-brandsoftgray [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none block w-full border rounded-md py-2 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-brandprimary border-brandsteel"
              />
              {errors.totalPag && (
                <p className="mt-1 text-xs text-brandalert">
                  {errors.totalPag}
                </p>
              )}
            </div>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="
                w-40
                inline-flex items-center justify-center
                py-2.5
                rounded-[10px]
                gap-[10px]
                bg-brandsteel
                text-white font-medium
                hover:bg-brandmediumblue 
                transition-colors duration-200
              "
            >
              Adicionar
            </button>
          </div>
        </form>
      </Modal>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este item da lista? Esta ação não
            pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

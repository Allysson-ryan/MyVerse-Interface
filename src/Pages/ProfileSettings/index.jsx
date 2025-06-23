import { Logout, AccountCircle } from "@mui/icons-material";
import { logoutUser } from "../../utils/logout";
import { getUserData } from "../../utils/authStorage";

export default function ProfileSettings() {
  const userData = getUserData();
  const nome = userData?.nome || "Usuário";

  return (
    <section className="flex justify-center items-center mt-[3rem] bg-white px-4">
      <div className="aspect-square w-full max-w-sm border border-brandsoftgray rounded-lg shadow-sm p-8 text-center flex flex-col justify-center items-center">
        <div className="mb-4">
          <AccountCircle style={{ fontSize: 64 }} className="text-black" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{nome}</h2>
        <button
          type="button"
          onClick={logoutUser}
          className="inline-flex items-center gap-2 px-4 py-2 mt-[3rem] border border-black rounded-md text-sm font-medium text-black bg-white hover:bg-gray-100 transition"
        >
          <Logout fontSize="small" />
          Sair da Aplicação
        </button>
      </div>
    </section>
  );
}

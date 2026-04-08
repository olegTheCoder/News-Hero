import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";

export default function Result() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-5xl mx-auto w-full py-8 md:py-12 flex flex-col gap-8 items-center">
        <div className="w-full relative">
          <div className="border-4 border-primary p-2 bg-surface-container-lowest shadow-[8px_8px_0px_0px_rgba(202,253,0,1)]">
            <img
              alt="Cyberpunk aesthetic high-voltage digital art, vibrant acid lime and neon purple glitch effects"
              className="w-full h-auto object-cover border-2 border-primary-dim"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUiatOmi4q4z0EaDL40I0Kn84rpGNWUEjaqb3CCxhxQxDbDCF9tXRftLdpjbXkXlyDn-reITGof98aMPlvHttLySW2R9vM95V19uryd4TTgHUi0zdKT7tc__Pia3WM_a2LWr0E9x6WkyrtFl1zuStkBvIa2qt5YmX3SCFD5bcdFFT656uUgZ2owjJbm8McV6HPFrMo93vqhmxgilD5ssfEwqVEKzQ0yrEAJ5nScmA1OagHXsAwpkx3JXfFBchfWFri8M0m5Fla3Qk"
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <ActionButton
            variant="primary"
            icon="download"
            onClick={() => {}}
          >
            СКАЧАТЬ
          </ActionButton>
          <ActionButton
            variant="secondary"
            icon="refresh"
            onClick={() => navigate("/")}
          >
            СГЕНЕРИРОВАТЬ СНОВА
          </ActionButton>
        </div>
      </div>
    </main>
  );
}

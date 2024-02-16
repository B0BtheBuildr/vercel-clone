import "./App.css";
import GoToPageForm from "./components/formComponents/GoToPageForm";
import UploadForm from "./components/formComponents/UploadForm";
import { Toaster } from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { displayState } from "./atoms";

function App() {
  const { isDeployed, uploadID } = useRecoilValue(displayState);
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-slate-100 justify-evenly pb-20">
      <UploadForm></UploadForm>
      {isDeployed && <GoToPageForm uploadID={uploadID}></GoToPageForm>}
      <Toaster></Toaster>
    </div>
  );
}

export default App;

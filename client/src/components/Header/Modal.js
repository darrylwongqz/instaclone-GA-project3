import React, {
  Fragment,
  useRef,
  useState,
  // useContext,
  useEffect,
} from "react";
import { useRecoilState } from "recoil";
import { Dialog, Transition } from "@headlessui/react";
import { CameraIcon } from "@heroicons/react/outline";
import { modalState } from "../../atoms/modalAtom";
import { postDataState } from "../../atoms/modalAtom";
// import UserContext from "../../context/user";
import axios from "axios";
import { useHistory } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

function Modal() {
  const history = useHistory();
  // const { state, dispatch } = useContext(UserContext);
  const [open, setOpen] = useRecoilState(modalState);
  const [data, setData] = useRecoilState(postDataState);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  //   console.log("state", state);
  // console.log("post data at Modal state", data);
  //After posting image to cloud, image url updated above, send entire post to "/createpost"
  useEffect(() => {
    if (url) {
      axios({
        method: "POST",
        url: "/api/posts/create",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
          //Note that we stored the jwt token in localstorage when user signed in
        },
        data: {
          caption: captionRef.current.value,
          image: url,
        },
      })
        .then((response) => {
          // console.log("modal line 49", response.data);
          setData([response.data, ...data]);
          setOpen(false);
          setLoading(false);
          setSelectedFile(null);
          history.push(ROUTES.DASHBOARD);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  }, [url]);

  const uploadPost = () => {
    //post the image to cloudinary, and then the useEffect above will take care of uploading the entire post to database
    // Posting image to cloudinary (separate from DB) - you only want to save the image URL in the DB,
    // and only if there is a title and body
    if (!captionRef.current.value.trim() || !selectedFile) {
      setError("Please fill in the relevant fields");
      return;
    }
    //will only make POST request to cloudinary if there is a title and body field accompanying it
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "insta-clone-v0.1");
    formData.append("cloud_name", "darrylwongqz");
    axios({
      method: "POST",
      url: "https://api.cloudinary.com/v1_1/darrylwongqz/image/upload",
      data: formData,
    })
      .then((response) => setUrl(response.data.secure_url))
      .catch((error) => console.log(error.response.data.error));
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                {selectedFile ? (
                  <img
                    onClick={() => setSelectedFile(null)}
                    className="w-full object-contain cursor-pointer"
                    src={selectedFile}
                    alt=""
                  />
                ) : (
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                  >
                    <CameraIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                )}

                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Upload a photo
                      {error && (
                        <p
                          data-testid="error"
                          className="mb-4 text-xs text-red-400"
                        >
                          {error}
                        </p>
                      )}
                    </Dialog.Title>

                    <div>
                      <input
                        ref={filePickerRef}
                        type="file"
                        hidden
                        onChange={addImageToPost}
                      />
                    </div>

                    <div className="mt-2">
                      <input
                        className="border-none focus:ring-0 w-full text-center"
                        type="text"
                        ref={captionRef}
                        placeholder="Please enter a caption..."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    disabled={!selectedFile}
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
                    onClick={uploadPost}
                  >
                    {loading ? "Uploading..." : "Upload Post"}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;

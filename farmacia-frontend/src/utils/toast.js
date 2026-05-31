import Swal from "sweetalert2";

//import { toast } from "react-toastify";

export const toastSuccess = (msg) => {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: msg,
        showConfirmButton: false,
        timer: 2000,    

    });
};

export const toastError = (msg) => {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: msg,
        showConfirmButton: false,
        timer: 2500
    });
};

export const toastWarning = (msg) => {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: msg,
        showConfirmButton: false,
        timer: 2500   

    });
};
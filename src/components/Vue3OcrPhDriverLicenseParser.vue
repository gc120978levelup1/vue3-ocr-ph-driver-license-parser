<script setup lang="ts">
import { ref } from 'vue';
import Tesseract from 'tesseract.js';

const emit = defineEmits([
    'onProgress',
    'onParse',
]);

const props = defineProps([
    'textOutput',
    'fileDOM',
    'imageDOM'
]);

// <Vue3OcrPhDriverLicenseParser :evTextOutput="" :vFileDOM="" :vImageDOM="" @onParse="" />
//////START JS CODE
// DOM Identification

// Start OCR Parser for Drivers License
const ocrToDriversLicenseJSON = (strOCR) => {
    let split_str = strOCR.split("\n");
    let data = {
        license_id: "",
        expiry: "",
        name: "",
        address: "",
        birthDate: "",
        nationality: "",
        sex: "",
    };
    split_str.forEach((str, i) => {
        let STR1 = str.toUpperCase();
        if (
            STR1.includes("LAST") ||
            STR1.includes("NAME") ||
            STR1.includes("FIRST") ||
            STR1.includes("MIDDLE")
        ) {
            data.name = split_str[i + 1]
                .replace(/[^A-Z,., ]/g, "")
                .replace(/^\s+/, "")
                .replace(/\s+$/, "");
        }
        if (
            STR1.includes("ADDRESS") ||
            STR1.includes("ADDR") ||
            STR1.includes("DDRESS") ||
            STR1.includes("ADDRES")
        ) {
            data.address =
                split_str[i + 1].replace(/[^A-Z, ]/g, "").replace(/^\s+/, "") +
                " " +
                split_str[i + 2].replace(/[^A-Z, ]/g, "").replace(/^\s+/, "");
        }
        if (
            STR1.includes("AGENCY") ||
            STR1.includes("EXPIRATION") ||
            STR1.includes("CODE")
        ) {
            data.license_id = split_str[i + 1]
                .split(/\s+/)
                .filter((word) => word.includes("-"))[0];
        }
        if (
            STR1.includes("AGENCY") ||
            STR1.includes("EXPIRATION") ||
            STR1.includes("CODE")
        ) {
            data.expiry = split_str[i + 1]
                .split(/\s+/)
                .filter((word) => word.includes("/"))[0];
        }
        if (STR1.includes("NATIONALITY") || STR1.includes("SEX")) {
            data.birthDate = split_str[i + 1].split(/\s+/).filter((word, k) => {
                let ret = word.includes("/");
                if (ret) {
                    data.nationality = split_str[i + 1]
                        .split(/\s+/)
                    [k - 2].replace(/[^A-Z,]/g, "");
                    data.sex = split_str[i + 1]
                        .split(/\s+/)
                    [k - 1].replace(/[^A-Z,]/g, "");
                }
                return ret;
            })[0];
        }
    });
    //console.log(data);
    return data;
};
// End OCR Parser for Drivers License

// Start Otical Character Recognition
const startOCR = (URL, File, outputDiv) => {
    let ret = null;
    Tesseract.recognize(URL, "eng", {
        logger: (m) => {
            //console.log(m);
            if (m.progress){
               emit("onProgress", m.progress * 100);
            };
            if (outputDiv) {
                outputDiv.hidden = false;
                //outputDiv.innerHTML = "Processing .... <br/>" + JSON.stringify(m);
            }
        },
    }).then(({ data: { text } }) => {
        //console.log(text);
        let ocrData = ocrToDriversLicenseJSON(text);
        ret = {
            file: File,
            URL: URL,
        };
        Object.assign(ret, ocrData); // merge ret and ocrData into ret
        ///////////////////////////////////////////////////////////////////////////////// vue emit here
        emit("onParse", ret);
        if (outputDiv) {
            outputDiv.hidden = true;
        }
    });
};
// End Otical Character Recognition

// Start Open an Image file to perform OCR

const openFile = (xfile: Blob) => {
    const reader = new FileReader();
    let rawBase64 = null;
    reader.readAsDataURL(xfile); // coverts file(blob) to base64 URL
    reader.onloadend = () => {
        if (props.imageDOM)
            props.imageDOM.src = reader.result;
        rawBase64 = reader.result;
        startOCR(rawBase64, xfile, props.textOutput); // for vue -> textOutput.value where textOutput = ref()
    };
};

const openURL = (URL) => {
    startOCR(URL, null, props.textOutput);
}

if (props.textOutput) props.textOutput.hidden = false;

defineExpose({
    openFile,
    openURL,
});


// End Open an Image file to perform OCR


/*
    <!-- Start of Web Cam Component -->
    <Camera ref="camera" visible="false" @onTakePicture="handleTakePix" @onEncodeQRCode="handleEncodeQRCode"/>
    <!-- End of Web Cam Component -->
*/
</script>

<template>
    <div v-show="false">
    </div>
</template>
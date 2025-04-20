# Vue3 OCR Parcer for Laravel + Vue + ShadCn projects

This laravel component is only applicable to projects made in Laravel + Vue + ShadCn
It functions both as a camera to take pictures and a QR Code Reader. The component contains
1 button that will emit an event whenever it is clicked and output parameters for the picuture URL and file.
And also whenever QRCode is shoved into it, another kind of event will be triggered outputing the text that is
contained in the QR Code.

## Installation To Your Project

```sh
npm install vue3-ocr-ph-driver-license-parser
```

## Project Use Case

* In this example the Philippine License image is obtained using input file DOM and is submitted to Vue3OcrPhDriverLicenseParser through openFile method in fileChange event handler.

* the handProgress is fired whenever the image parsing progress has changed.

* finally, handleParse is fired when the image parsing is done and output a JSON Object containing the data

ex.

    data = {
        license_id  : <parsed_license_id>,
        expiry      : <parsed_expiry_date>,
        name        : <parsed_license_holder_name>,
        address     : <parsed_license_holder_addreass>,
        birthDate   : <parsed_birthday>,
        nationality : <parsed_birthday>,
        sex         : <parsed_sex>,
        URL         : <URL_of_image>,
        file        : <Blob_File_of_image>,
    };

Note: normally data.file is saved using S3 bucket and the rest will be saved in database

### Sample Code

```sh

<script setup lang="ts">

import { Progress } from '@/components/ui/progress'; // a shadcn component
import { Vue3OcrPhDriverLicenseParser } from 'vue3-ocr-ph-driver-license-parser';
const parser1 = ref();
const textOutput = ref();
const imageDOM = ref();
const progress = ref(0);
const fileChange = (event) => {
    parser1.value.openFile(event.target.files[0]);
    console.log(event);
}
const handleProgress = (event) => {
    progress.value = event;
}
const handleParse = (event) => {
    console.log("output ng laravel...........");
    console.log("output ng laravel...........",event);
}

</script>

<template>

    <div ref="textOutput">
        <Progress :model-value="progress" />
    </div>
    <img ref="imageDOM" />
    <span>Open File</span>
    <input type="file" accept="image/*" @change="fileChange"/>
    <Vue3OcrPhDriverLicenseParser 
        ref="parser1" 
        :textOutput="textOutput"
        :imageDOM="imageDOM" 
        @onProgress="handleProgress" 
        @onParse="handleParse" 
    />

</template>

```

## Installing to npm package

```sh
npm login
```

```sh
npm publish
```


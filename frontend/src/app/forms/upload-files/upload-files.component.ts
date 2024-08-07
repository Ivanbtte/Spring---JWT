import { Component, OnInit } from '@angular/core';
import { FileService } from 'src/app/services/fileService/file.service';


@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent{

  selectedFile!: File;

  constructor(private fileService: FileService) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  onUpload() {
    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Upload successful', response);
      },
      error: (error) => {
        console.error('Upload failed', error);
      }
    });
  }

  onDownload(fileId: string) {
    const id = +fileId; // Convertir el string a número
    this.fileService.downloadFile(id).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'downloadedFile';
      a.click();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ExamService } from '../_core/_services/exam.service';
import { AuthService } from '../../pages/core/service/auth.service';

interface Certificate {
  name: string;
  purchaseDate: string;
  courseId: number; 
  pdf: string;
}


@Component({
  selector: 'app-certyfikaty',
  templateUrl: './certyfikaty.component.html',
  styleUrls: ['./certyfikaty.component.scss']
})
export class CertyfikatyComponent implements OnInit {
  public certificates: Certificate[] = [];
  isData: boolean = true;

  constructor(
    private examService: ExamService,
    private authService: AuthService // Assuming AuthService provides user-related information
  ) {}

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {
    const userId = this.authService.getUserData().userId; // Ensure this method exists and returns the correct userId

    this.examService.getCertificates(userId).subscribe((data: Certificate[]) => {
      // console.log('data.length ',data.length)
      if(data.length > 0){
      
        this.certificates = data.map(cert => ({
          ...cert,
          purchaseDate: new Date(cert.purchaseDate).toLocaleDateString(),
          pdf: cert.pdf // Ensure this is an absolute URL to the PDF
        }));
      }
    }, error => {
        console.error('Error fetching certificates:', error);
      });
      }
     
  

  downloadCertificate(courseId: number): void {
    const userId = this.authService.getUserData().userId;
  
    this.examService.getCertificateBlob(userId, courseId).subscribe(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `certificate-${courseId}.pdf`; // Customize filename as needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    }, error => {
      console.error('Error downloading certificate:', error);
    });
  }
  
  
}

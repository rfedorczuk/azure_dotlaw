import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../pages/core/service/user.service";
import { AvatarService } from "../../pages/core/service/avatar.service";
import { ToastService } from "../_core/_services/toast.service";
import { EventTypes } from "../_core/_models/event-types";
import { AuthService } from "../../pages/core/service/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "my-app-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"],
})
export default class MyProfileComponent implements OnInit {
  user: any = {};
  selectedFile: File | null = null;

  currentPasswordError: string = "";
  newPasswordError: string = "";

  @ViewChild("fileInput", { static: false }) fileInput?: ElementRef;

  constructor(
    private userService: UserService,
    private avatarService: AvatarService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe((data) => {
      // alert(JSON.stringify(data))
      this.user = data;
    });
  }

  onAvatarClick(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files) {
      this.selectedFile = <File>eventTarget.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatar = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateProfile(): void {
    if (!this.user.name || !this.user.surname || !this.user.email) {
      this.toastService.showToast(
        EventTypes.Error,
        "Błąd",
        "Wprowadź wszystkie wymagane dane!"
      );
      return;
    }

    const profileData = new FormData();
    profileData.append("name", this.user.name);
    profileData.append("surname", this.user.surname);
    profileData.append("email", this.user.email);

    if (this.selectedFile) {
      profileData.append("avatar", this.selectedFile, this.selectedFile.name);
    }

    this.userService.updateProfile(profileData).subscribe({
      next: (response) => {
        this.toastService.showToast(
          EventTypes.Success,
          "Sukces",
          "Profil został pomyślnie zaktualizowany!"
        );
        if (response.avatar) {
          this.user.avatar = response.avatar;
          this.avatarService.updateAvatarUrl(response.avatar);
        } else {
          console.error("Brak avatara w odpowiedzi");
        }
      },
      error: (error) => {
        console.error("Error response", error);
        this.toastService.showToast(
          EventTypes.Error,
          "Błąd",
          "Wystąpił błąd, spróbuj raz jeszcze lub skontaktuj się z Działem obsługi klienta."
        );
      },
    });
  }

  changePassword(): void {
    this.currentPasswordError = "";
    this.newPasswordError = "";

    if (!this.user.currentPassword) {
      this.toastService.showToast(
        EventTypes.Error,
        "Błąd",
        "Wprowadź aktualne hasło"
      );
      return;
    }
    if (!this.user.newPassword) {
      this.toastService.showToast(
        EventTypes.Error,
        "Błąd",
        "Wprowadź nowe hasło"
      );
      return;
    }

    this.userService
      .changePassword(this.user.currentPassword, this.user.newPassword)
      .subscribe({
        next: () => {
          this.toastService.showToast(
            EventTypes.Success,
            "Sukces",
            "Hasło zostało zmienione!"
          );
        },
        error: (error) => {
          console.error("Error response", error.error.error);
          const errorMessage = error.error.error
            ? `${error.error.error}: ${error.error.message}`
            : error.message;

          if (errorMessage.includes("incorrect_password")) {
            console.log("incorrect_password");
            this.toastService.showToast(
              EventTypes.Error,
              "Błąd",
              "Aktualne hasło jest niepoprawne."
            );
          } else {
            this.toastService.showToast(
              EventTypes.Error,
              "Błąd",
              "Wystąpił błąd podczas zmiany hasła."
            );
          }
        },
      });
  }

  deleteAccount(): void {
    const confirmed = confirm('Czy na pewno chcesz usunąć swoje konto?');
    if (confirmed) {
        this.userService.deleteUser(this.user.id).subscribe({
            next: () => {
                this.toastService.showToast(EventTypes.Success, "Sukces", "Konto zostało usunięte.");
                this.authService.logout();
                this.router.navigate(['/profile-authentication']);
            },
            error: (error) => {
                console.error("Error response", error);
                this.toastService.showToast(EventTypes.Error, "Błąd", "Nie udało się usunąć konta.");
            },
        });
    }
}


}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationInitiationRequest } from 'src/app/account/model/registration-initiation-request';
import { AppResponse } from '../models/app-response';
import { RegistrationInitiationResponse } from 'src/app/account/model/registration-initiation-response';
import { AppConstants } from '../constants/app-constants';
import { OtpValidationRequest } from 'src/app/account/model/otp-validation-request';
import { RegistrationCompletionRequestDto } from 'src/app/account/model/registration-completion-request-dto';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {

  constructor(private http: HttpClient) {
  }


  /**
       * initiateRegistration
       * @param registrationInitiationRequest
       */
  initiateRegistration(registrationInitiationRequest: RegistrationInitiationRequest) {
    return this.http.post<AppResponse<RegistrationInitiationResponse>>(AppConstants.API.INITIATE_REGISTRATION, registrationInitiationRequest);
  }

  /**
     * validateOtp
     * @param otpValidationRequest
     */
  validateOtp(otpValidationRequest: OtpValidationRequest) {
    return this.http.post<AppResponse<RegistrationInitiationResponse>>(AppConstants.API.REGISTRATION_OTP_VALIDATION, otpValidationRequest);
  }


  /**
     * resendOtp
     * @param registrationInitiationRequest
     */
  resendOtp(registrationInitiationRequest: RegistrationInitiationRequest) {
    return this.http.post<AppResponse<RegistrationInitiationResponse>>(AppConstants.API.REGISTRATION_RESEND_OTP, registrationInitiationRequest);
  }

  /**
   * completeRegistration
   * @param registrationCompletionRequestDto
   */
  completeRegistration(registrationCompletionRequestDto: RegistrationCompletionRequestDto) {
    return this.http.post<AppResponse<void>>(AppConstants.API.COMPLETE_REGISTRATION, registrationCompletionRequestDto);
  }
}

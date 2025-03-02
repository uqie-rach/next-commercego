"use client";

import React from "react";
import Image from "next/image";
import { Globe2Icon, Loader2, PencilIcon } from "lucide-react";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodError } from "zod";
import toast from "react-hot-toast";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";

import { useModal } from "@/hooks/useModal";
import { useUser } from "@/context/UserContext";
import { updateUserValidator } from "@/lib/validations/user";

// Define the type of the form data
type FormData = z.infer<typeof updateUserValidator>

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useUser();

  // Form handler
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(updateUserValidator)
  })

  async function handleUpdateUser(userData: FormData) {
    try {
      const data = updateUserValidator.parse(userData);

      const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${user?.id}`, {
        ...data
      });

      if (response.status === 200) {
        toast('User updated successfully', {
          icon: '👏',
        })
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        const errorMessage = error?.response?.data?.message;
        if (errorMessage) {
          Object.keys(errorMessage).forEach((key) => {
            setError(key as keyof FormData, { message: errorMessage[key] });
          });
        }
        return;
      }

      if (error instanceof ZodError) {
        error.errors.forEach((err) => {
          setError(err.path[0] as keyof FormData, { message: err.message });
        });
        return;
      }
    } finally {
      closeModal()
      setTimeout(() => window.location.reload(), 1500);
    }

  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={user?.image ? user?.image : "/images/user/owner.jpg"}
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user?.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.profile?.duty || "duty"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.profile?.location || "location"}
                </p>
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              <a href={user?.profile?.website ?? 'https://www.facebook.com'} target="_blank"
                rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                <Globe2Icon size={20} />
              </a>

              <a href={user?.profile?.twitter ?? 'https://x.com'} target="_blank"
                rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z"
                    fill=""
                  />
                </svg>
              </a>

              <a href={user?.profile?.linkedin ?? "https://www.linkedin.com/company/gdgocmaliki"} target="_blank"
                rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"
                    fill=""
                  />
                </svg>
              </a>

              <a href={user?.profile?.github ?? 'https://github.com'} target="_blank"
                rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 0.833374C4.93333 0.833374 0.833328 4.93337 0.833328 10C0.833328 14.0417 3.49999 17.4167 7.16666 18.6167C7.63333 18.7 7.79166 18.425 7.79166 18.1834C7.79166 17.9667 7.78333 17.3 7.77916 16.5417C5.14583 17.0917 4.58333 15.3334 4.58333 15.3334C4.14166 14.2834 3.50833 14 3.50833 14C2.65833 13.4167 3.57499 13.4284 3.57499 13.4284C4.51666 13.4917 5.02499 14.3917 5.02499 14.3917C5.87499 15.8 7.22916 15.3767 7.81249 15.1417C7.89166 14.5584 8.12499 14.1417 8.37916 13.9C6.29166 13.6584 4.09166 12.8667 4.09166 9.36671C4.09166 8.35004 4.46666 7.51671 5.04166 6.86671C4.94999 6.63337 4.62083 5.70004 5.13333 4.45837C5.13333 4.45837 5.93749 4.21254 7.76666 5.44587C8.46666 5.24587 9.23333 5.14587 9.99999 5.14171C10.7667 5.14587 11.5333 5.24587 12.2333 5.44587C14.0625 4.21254 14.8667 4.45837 14.8667 4.45837C15.3792 5.70004 15.05 6.63337 14.9583 6.86671C15.5333 7.51671 15.9083 8.35004 15.9083 9.36671C15.9083 12.8751 13.7042 13.6542 11.6125 13.8917C11.9292 14.1917 12.2125 14.7917 12.2125 15.7084C12.2125 17.0417 12.2 17.8834 12.2 18.1834C12.2 18.4284 12.3583 18.7067 12.8333 18.6167C16.5 17.4167 19.1667 14.0417 19.1667 10C19.1667 4.93337 15.0667 0.833374 10 0.833374Z"
                    fill=""
                  />
                </svg>
              </a>

              <a href={user?.profile?.instagram ?? 'https://instagram.com'} target="_blank"
                rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z"
                    fill=""
                  />
                </svg>
              </a>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <PencilIcon size={18} />
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form onSubmit={handleSubmit(handleUpdateUser)} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Github</Label>
                    <Input
                      {...register('github')}
                      type="text"
                      defaultValue={user?.profile?.github ?? "https://www.github.com"}
                      error={!!errors.name}
                      hint={errors.name?.message}
                    />
                    {
                      errors.github && <p className="mt-3 text-sm text-error-500">
                        {errors.github?.message}
                      </p>
                    }
                  </div>
                  <div>
                    <Label>Personal Website</Label>
                    <Input
                      {...register('website')}
                      type="text"
                      defaultValue={user?.profile?.website ?? "https://www.google.com"}
                      error={!!errors.name}
                      hint={errors.name?.message}
                    />
                    {
                      errors.website && <p className="mt-3 text-sm text-error-500">
                        {errors.website?.message}
                      </p>
                    }
                  </div>

                  <div>
                    <Label>X.com</Label>
                    <Input
                      {...register('twitter')}
                      type="text"
                      defaultValue={user?.profile?.twitter ?? "https://x.com"}
                      error={!!errors.name}
                      hint={errors.name?.message}
                    />
                    {
                      errors.twitter && <p className="mt-3 text-sm text-error-500">
                        {errors.twitter?.message}
                      </p>
                    }
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      {...register('linkedin')}
                      type="text"
                      defaultValue={user?.profile?.linkedin ?? "https://www.linkedin.com/company/pimjo"}
                      error={!!errors.name}
                      hint={errors.name?.message}
                    />
                    {
                      errors.linkedin && <p className="mt-3 text-sm text-error-500">
                        {errors.linkedin?.message}
                      </p>
                    }
                  </div>

                  <div className="col-span-2">
                    <Label>Instagram</Label>
                    <Input
                      {...register('instagram')}
                      type="text"
                      defaultValue={user?.profile?.instagram ?? "https://instagram.com"}
                      error={!!errors.name}
                      hint={errors.name?.message}
                    />
                    {
                      errors.instagram && <p className="mt-3 text-sm text-error-500">
                        {errors.instagram?.message}
                      </p>
                    }
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>FullName</Label>
                    <Input {...register('name')} type="text" defaultValue={user?.name ?? "name"} />
                    {
                      errors.name && <p className="mt-3 text-sm text-error-500">
                        {errors.name?.message}
                      </p>
                    }
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Duty</Label>
                    <Select
                      {...register('duty')}
                      options={[
                        { value: "lead", label: "Lead" },
                        { value: "core", label: "Core" },
                        { value: "associate core", label: "Associate Core" },
                      ]}
                      defaultValue="user"
                      placeholder="Select a role"
                      error={!!errors.duty}
                      hint={errors.duty?.message}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input {...register('email')} type="text" defaultValue={user?.email ?? "youremail@gmail.com"} />
                    {
                      errors.email && <p className="mt-3 text-sm text-error-500">
                        {errors.email?.message}
                      </p>
                    }
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>location</Label>
                    <Input {...register('location')} type="text" defaultValue={user?.profile?.location ?? "City, Country"} />
                    {
                      errors.location && <p className="mt-3 text-sm text-error-500">
                        {errors.location?.message}
                      </p>
                    }
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input {...register('phone')} type="text" defaultValue={user?.profile?.phone ?? "+62884848102"} />
                    {
                      errors.phone && <p className="mt-3 text-sm text-error-500">
                        {errors.phone?.message}
                      </p>
                    }
                  </div>

                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <TextArea {...register('bio')} rows={3} placeholder="Bio" defaultValue={user?.profile?.bio} />
                    {
                      errors.bio && <p className="mt-3 text-sm text-error-500">
                        {errors.bio?.message}
                      </p>
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-3 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" disabled={isSubmitting}>
                {
                  isSubmitting && <Loader2 className='animate-spin h-4 w-4' /> || null
                }
                Save Changes
              </Button>
            </div>
          </form>
        </div >
      </Modal >
    </>
  );
}

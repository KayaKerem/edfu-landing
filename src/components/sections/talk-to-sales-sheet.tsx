"use client";

import type { ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
  useExpandableScreen,
} from "@/components/ui/expandable-screen";
import { cn } from "@/lib/utils";

interface TalkToSalesSheetDict {
  title: string;
  subtitle: string;
  firstName: string;
  firstNamePlaceholder: string;
  lastName: string;
  lastNamePlaceholder: string;
  companyEmail: string;
  companyEmailPlaceholder: string;
  phoneNumber: string;
  phoneNumberPlaceholder: string;
  region: string;
  regionPlaceholder: string;
  numberOfUsers: string;
  numberOfUsersPlaceholder: string;
  details: string;
  detailsPlaceholder: string;
  submit: string;
  privacyPrefix: string;
  privacyPolicy: string;
  privacyJoiner: string;
  termsOfService: string;
  privacySuffix: string;
}

interface TalkToSalesSheetProps {
  trigger: ReactNode;
  dict: TalkToSalesSheetDict;
  layoutId: string;
  triggerClassName?: string;
}

function SalesFormPanel({ dict }: { dict: TalkToSalesSheetDict }) {
  const { collapse } = useExpandableScreen();

  return (
    <div className="mx-auto flex h-full w-full max-w-[560px] items-center justify-center">
      <div className="relative w-full rounded-[28px] border border-black/8 dark:border-white/8 bg-[#f3f3f4] dark:bg-[#1c1c1f] p-5 shadow-[0_30px_80px_rgba(15,23,42,0.14)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:p-6">
        <button
          type="button"
          onClick={collapse}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#27272a] text-[#52525b] dark:text-[#a1a1aa] shadow-sm transition-colors hover:bg-[#f8f8f8] dark:hover:bg-[#3f3f46]"
          aria-label="Close sales form"
        >
          <X className="size-4" />
        </button>

        <div className="pr-12">
          <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-[#171717] dark:text-[#f4f4f5] sm:text-[32px]">
            {dict.title}
          </h2>
          <p className="mt-1 text-[15px] text-[#5f6368] dark:text-[#9194a1] sm:text-[16px]">
            {dict.subtitle}
          </p>
        </div>

        <form className="mt-6 space-y-2" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-2 sm:grid-cols-2">
            <FormField
              label={dict.firstName}
              input={
                <Input placeholder={dict.firstNamePlaceholder} autoComplete="given-name" />
              }
            />
            <FormField
              label={dict.lastName}
              input={
                <Input placeholder={dict.lastNamePlaceholder} autoComplete="family-name" />
              }
            />
          </div>

          <FormField
            label={dict.companyEmail}
            input={
              <Input
                type="email"
                placeholder={dict.companyEmailPlaceholder}
                autoComplete="email"
              />
            }
          />

          <FormField
            label={dict.phoneNumber}
            input={
              <Input
                type="tel"
                placeholder={dict.phoneNumberPlaceholder}
                autoComplete="tel"
              />
            }
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <FormField
              label={dict.region}
              input={
                <Select defaultLabel={dict.regionPlaceholder}>
                  <option value="emea">EMEA</option>
                  <option value="north-america">North America</option>
                  <option value="latam">LATAM</option>
                  <option value="apac">APAC</option>
                </Select>
              }
            />
            <FormField
              label={dict.numberOfUsers}
              input={
                <Select defaultLabel={dict.numberOfUsersPlaceholder}>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-250">51-250</option>
                  <option value="250+">250+</option>
                </Select>
              }
            />
          </div>

          <FormField
            label={dict.details}
            input={<Textarea placeholder={dict.detailsPlaceholder} />}
          />

          <button
            type="submit"
            className="mt-2 mb-5 relative flex h-[50px] w-full items-center justify-center rounded-2xl bg-[#1f2027] dark:bg-[#3b82f6] text-[16px] font-medium text-white transition-colors hover:bg-[#16171d] dark:hover:bg-[#2563eb]"
          >
            {dict.submit}
          </button>

          <p className="absolute bottom-5 left-8 max-w-[500px] text-[10px] leading-5 text-[#666b73] dark:text-[#71717a]">
            {dict.privacyPrefix}{" "}
            <a href="#" className="underline underline-offset-2">
              {dict.privacyPolicy}
            </a>{" "}
            {dict.privacyJoiner}{" "}
            <a href="#" className="underline underline-offset-2">
              {dict.termsOfService}
            </a>{" "}
            {dict.privacySuffix}
          </p>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, input }: { label: string; input: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-[#6b7280] dark:text-[#9194a1]">
        {label}
      </span>
      {input}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-[40px] w-full rounded-2xl border border-[#d9dce1] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] px-4 text-[15px] text-[#171717] dark:text-[#f4f4f5] shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition-colors placeholder:text-[#8b919b] dark:placeholder:text-[#71717a] focus:border-[#c2c8d0] dark:focus:border-[#52525b]"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={3}
      className="min-h-[104px] w-full resize-none rounded-2xl border border-[#d9dce1] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] px-4 py-3 text-[15px] text-[#171717] dark:text-[#f4f4f5] shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition-colors placeholder:text-[#8b919b] dark:placeholder:text-[#71717a] focus:border-[#c2c8d0] dark:focus:border-[#52525b]"
    />
  );
}

function Select({
  children,
  defaultLabel,
}: {
  children: ReactNode;
  defaultLabel: string;
}) {
  return (
    <div className="relative">
      <select
        defaultValue=""
        className="h-[44px] w-full appearance-none rounded-2xl border border-[#d9dce1] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] px-4 pr-10 text-[15px] text-[#6b7280] dark:text-[#9194a1] shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition-colors focus:border-[#c2c8d0] dark:focus:border-[#52525b]"
      >
        <option value="" disabled>
          {defaultLabel}
        </option>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#8b919b]" />
    </div>
  );
}

export function TalkToSalesSheet({
  trigger,
  dict,
  layoutId,
  triggerClassName,
}: TalkToSalesSheetProps) {
  return (
    <ExpandableScreen
      layoutId={layoutId}
      triggerRadius="16px"
      contentRadius="28px"
      animationDuration={0.28}
    >
      <ExpandableScreenTrigger className={cn("block w-full", triggerClassName)}>
        {trigger}
      </ExpandableScreenTrigger>
      <ExpandableScreenContent
        showCloseButton={false}
        className="bg-transparent px-3 py-3 sm:px-4"
      >
        <SalesFormPanel dict={dict} />
      </ExpandableScreenContent>
    </ExpandableScreen>
  );
}

"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { Textarea } from "@/components/Textarea"
import {
  integrationAuthTypes,
  integrationEnvironments,
  integrationStatuses,
  integrationSyncFrequencies,
  integrationTypes,
  type Integration,
} from "@/data/integrations/data"
import { RiInformationLine } from "@remixicon/react"
import React from "react"

export type IntegrationDrawerMode = "view" | "edit"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
})
const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

const Detail = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div className="grid grid-cols-3 gap-4 py-2.5">
    <dt className="text-sm text-gray-500 dark:text-gray-500">{label}</dt>
    <dd className="col-span-2 break-words text-sm text-gray-900 dark:text-gray-50">
      {children}
    </dd>
  </div>
)

const DetailGroup = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <section>
    <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500">
      {title}
    </h3>
    <dl className="mt-1 divide-y divide-gray-200 dark:divide-gray-800">
      {children}
    </dl>
  </section>
)

function IntegrationDetails({ integration }: { integration: Integration }) {
  const status = integrationStatuses[integration.status]
  return (
    <div className="space-y-6">
      <DetailGroup title="General">
        <Detail label="Integration">{integration.name}</Detail>
        <Detail label="Label">{integration.label}</Detail>
        <Detail label="Type">{integration.type}</Detail>
        <Detail label="Reseller">{integration.reseller}</Detail>
        <Detail label="Status">
          <Badge variant={status.variant}>{status.label}</Badge>
        </Detail>
        <Detail label="Description">{integration.description}</Detail>
      </DetailGroup>
      <DetailGroup title="Connection">
        <Detail label="Environment">
          {integrationEnvironments[integration.environment]}
        </Detail>
        <Detail label="Base URL">
          <span className="font-mono text-xs">{integration.baseUrl}</span>
        </Detail>
        <Detail label="Authentication">
          {integrationAuthTypes[integration.authType]}
        </Detail>
        <Detail label="Sync frequency">
          {integrationSyncFrequencies[integration.syncFrequency]}
        </Detail>
      </DetailGroup>
      <DetailGroup title="Activity">
        <Detail label="Contact">{integration.contactEmail}</Detail>
        <Detail label="Created">
          {dateFormatter.format(new Date(`${integration.createdAt}T00:00:00`))}
        </Detail>
        <Detail label="Last sync">
          {dateTimeFormatter.format(new Date(integration.lastSync))}
        </Detail>
      </DetailGroup>
    </div>
  )
}

type Errors = Partial<Record<keyof Integration, string>>

const validate = (form: Integration): Errors => {
  const errors: Errors = {}
  if (!form.name.trim()) errors.name = "Name is required."
  if (!form.label.trim()) errors.label = "Label is required."
  if (!/^https:\/\/\S+$/.test(form.baseUrl.trim()))
    errors.baseUrl = "Must start with https://"
  if (!/^\S+@\S+\.\S+$/.test(form.contactEmail.trim()))
    errors.contactEmail = "Enter a valid email."
  return errors
}

const Field = ({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint: string
  error?: string
  children: React.ReactNode
}) => (
  <div>
    <Label htmlFor={id} className="font-medium">
      {label}
    </Label>
    <div className="mt-2">{children}</div>
    <p
      className={
        error
          ? "mt-1.5 text-xs text-red-600 dark:text-red-500"
          : "mt-1.5 text-xs text-gray-500 dark:text-gray-500"
      }
    >
      {error ?? hint}
    </p>
  </div>
)

type SelectField =
  | "type"
  | "status"
  | "environment"
  | "authType"
  | "syncFrequency"

const selectOptions: Record<SelectField, Record<string, string>> = {
  type: Object.fromEntries(integrationTypes.map((type) => [type, type])),
  status: Object.fromEntries(
    Object.entries(integrationStatuses).map(([value, { label }]) => [
      value,
      label,
    ]),
  ),
  environment: integrationEnvironments,
  authType: integrationAuthTypes,
  syncFrequency: integrationSyncFrequencies,
}

const OptionSelect = ({
  id,
  field,
  form,
  onChange,
}: {
  id: string
  field: SelectField
  form: Integration
  onChange: (changes: Partial<Integration>) => void
}) => (
  <Select
    value={form[field]}
    onValueChange={(value) =>
      onChange({ [field]: value } as Partial<Integration>)
    }
  >
    <SelectTrigger id={id}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {Object.entries(selectOptions[field]).map(([value, label]) => (
        <SelectItem key={value} value={value}>
          {label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

function IntegrationForm({
  form,
  errors,
  onChange,
}: {
  form: Integration
  errors: Errors
  onChange: (changes: Partial<Integration>) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
        <RiInformationLine
          className="mt-0.5 size-5 shrink-0 text-indigo-600 dark:text-indigo-500"
          aria-hidden="true"
        />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="font-medium text-gray-900 dark:text-gray-50">
            How to fill this form
          </p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-4">
            <li>Identify the integration with a name and a label.</li>
            <li>
              Copy the base URL and auth method from the provider&apos;s
              developer portal.
            </li>
            <li>Use Sandbox first, switch to Production once tested.</li>
            <li>Add a contact who can fix connection errors.</li>
          </ol>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500">
          General
        </h3>
        <Field
          id="integration-name"
          label="Integration name"
          hint="Provider or platform name, e.g. Shopify."
          error={errors.name}
        >
          <Input
            id="integration-name"
            value={form.name}
            hasError={!!errors.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </Field>
        <Field
          id="integration-label"
          label="Label"
          hint="Tells apart accounts of the same provider, e.g. Store MX."
          error={errors.label}
        >
          <Input
            id="integration-label"
            value={form.label}
            hasError={!!errors.label}
            onChange={(e) => onChange({ label: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="integration-type"
            label="Type"
            hint="Category used for grouping."
          >
            <OptionSelect
              id="integration-type"
              field="type"
              form={form}
              onChange={onChange}
            />
          </Field>
          <Field
            id="integration-status"
            label="Status"
            hint="Disabled stops all requests."
          >
            <OptionSelect
              id="integration-status"
              field="status"
              form={form}
              onChange={onChange}
            />
          </Field>
        </div>
        <Field
          id="integration-reseller"
          label="Reseller"
          hint='Partner that manages it, or "Direct" if it is managed in-house.'
        >
          <Input
            id="integration-reseller"
            value={form.reseller}
            onChange={(e) => onChange({ reseller: e.target.value })}
          />
        </Field>
        <Field
          id="integration-description"
          label="Description"
          hint="What data this integration sends or receives."
        >
          <Textarea
            id="integration-description"
            rows={3}
            value={form.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500">
          Connection
        </h3>
        <Field
          id="integration-url"
          label="Base URL"
          hint="API root from the provider docs, starting with https://"
          error={errors.baseUrl}
        >
          <Input
            id="integration-url"
            value={form.baseUrl}
            hasError={!!errors.baseUrl}
            onChange={(e) => onChange({ baseUrl: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="integration-environment"
            label="Environment"
            hint="Sandbox uses test data."
          >
            <OptionSelect
              id="integration-environment"
              field="environment"
              form={form}
              onChange={onChange}
            />
          </Field>
          <Field
            id="integration-auth"
            label="Authentication"
            hint="Method required by the provider."
          >
            <OptionSelect
              id="integration-auth"
              field="authType"
              form={form}
              onChange={onChange}
            />
          </Field>
        </div>
        <Field
          id="integration-sync"
          label="Sync frequency"
          hint="Real time needs webhooks enabled on the provider."
        >
          <OptionSelect
            id="integration-sync"
            field="syncFrequency"
            form={form}
            onChange={onChange}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500">
          Contact
        </h3>
        <Field
          id="integration-email"
          label="Contact email"
          hint="Receives alerts when requests fail."
          error={errors.contactEmail}
        >
          <Input
            id="integration-email"
            type="email"
            value={form.contactEmail}
            hasError={!!errors.contactEmail}
            onChange={(e) => onChange({ contactEmail: e.target.value })}
          />
        </Field>
      </section>
    </div>
  )
}

type DrawerProps = {
  integration: Integration
  mode: IntegrationDrawerMode
  onClose: () => void
  onSave: (integration: Integration) => void
}

// Mounted only while open, so the form starts fresh each time
function DrawerInner({ integration, mode, onClose, onSave }: DrawerProps) {
  const [form, setForm] = React.useState(integration)
  const [submitted, setSubmitted] = React.useState(false)
  const errors = submitted ? validate(form) : {}
  const isEdit = mode === "edit"

  const update = (changes: Partial<Integration>) =>
    setForm((current) => ({ ...current, ...changes }))

  const save = () => {
    setSubmitted(true)
    if (Object.keys(validate(form)).length > 0) return
    onSave(form)
    onClose()
  }

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>
          {isEdit ? "Edit integration" : integration.name}
        </DrawerTitle>
        <DrawerDescription className="text-sm">
          {isEdit
            ? `${integration.name} · ${integration.label}`
            : integration.label}
        </DrawerDescription>
      </DrawerHeader>
      <DrawerBody className="-mx-6 overflow-y-auto px-6">
        {isEdit ? (
          <IntegrationForm form={form} errors={errors} onChange={update} />
        ) : (
          <IntegrationDetails integration={integration} />
        )}
      </DrawerBody>
      <DrawerFooter className="-mx-6 -mb-2 gap-2 px-6">
        <DrawerClose asChild>
          <Button variant="secondary" className="w-full sm:w-fit">
            {isEdit ? "Cancel" : "Close"}
          </Button>
        </DrawerClose>
        {isEdit && (
          <Button className="w-full sm:w-fit" onClick={save}>
            Save changes
          </Button>
        )}
      </DrawerFooter>
    </>
  )
}

export function IntegrationDetailsDrawer({
  integration,
  mode,
  open,
  onOpenChange,
  onSave,
}: Omit<DrawerProps, "integration" | "onClose"> & {
  integration: Integration | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-xl">
        {integration && (
          <DrawerInner
            integration={integration}
            mode={mode}
            onClose={() => onOpenChange(false)}
            onSave={onSave}
          />
        )}
      </DrawerContent>
    </Drawer>
  )
}

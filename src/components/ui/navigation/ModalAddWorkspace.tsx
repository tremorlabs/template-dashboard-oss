import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog"
import { DropdownMenuItem } from "@/components/Dropdown"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import {
  RadioCardGroup,
  RadioCardGroupIndicator,
  RadioCardItem,
} from "@/components/RadioCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"

export const databases: {
  label: string
  value: string
  description: string
  isRecommended: boolean
}[] = [
  {
    label: "Base performance",
    value: "base-performance",
    description: "1/8 vCPU, 1 GB RAM",
    isRecommended: true,
  },
  {
    label: "Advanced performance",
    value: "advanced-performance",
    description: "1/4 vCPU, 2 GB RAM",
    isRecommended: false,
  },
  {
    label: "Turbo performance",
    value: "turbo-performance",
    description: "1/2 vCPU, 4 GB RAM",
    isRecommended: false,
  },
]

export type ModalProps = {
  itemName: string
  onSelect: () => void
  onOpenChange: (open: boolean) => void
}

export function ModalAddWorkspace({
  itemName,
  onSelect,
  onOpenChange,
}: ModalProps) {
  return (
    <>
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger className="w-full text-left">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              onSelect && onSelect()
            }}
          >
            {itemName}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <form>
            <DialogHeader>
              <DialogTitle>Add new workspace</DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-6">
                With free plan, you can add up to 10 workspaces.
              </DialogDescription>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workspace-name" className="font-medium">
                    Workspace name
                  </Label>
                  <Input
                    id="workspace-name"
                    name="workspace-name"
                    placeholder="my_workspace"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="starter-kit" className="font-medium">
                    Starter kit
                  </Label>
                  <Select defaultValue="empty-workspace">
                    <SelectTrigger
                      id="starter-kit"
                      name="starter-kit"
                      className="mt-2"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty-workspace">
                        None - Empty workspace
                      </SelectItem>
                      <SelectItem value="commerce-analytics">
                        Commerce analytics
                      </SelectItem>
                      <SelectItem value="product-analytics">
                        Product analytics
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-full">
                  <Label htmlFor="database-region" className="font-medium">
                    Database region
                  </Label>
                  <Select defaultValue="europe-west-01">
                    <SelectTrigger
                      id="database-region"
                      name="database-region"
                      className="mt-2"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe-west-01">
                        europe-west-01
                      </SelectItem>
                      <SelectItem value="us-east-02">us-east-02</SelectItem>
                      <SelectItem value="us-west-01">us-west-01</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-2 text-xs text-gray-500">
                    For best performance, choose a region closest to your
                    application.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="database" className="font-medium">
                  Database configuration
                </Label>
                <RadioCardGroup
                  defaultValue={databases[0].value}
                  className="mt-2 grid grid-cols-1 gap-4 text-sm md:grid-cols-2"
                >
                  {databases.map((database) => (
                    <RadioCardItem key={database.value} value={database.value}>
                      <div className="flex items-start gap-3">
                        <RadioCardGroupIndicator className="mt-0.5" />
                        <div>
                          {database.isRecommended ? (
                            <div className="flex items-center gap-2">
                              <span className="leading-5">
                                {database.label}
                              </span>
                              <Badge>Recommended</Badge>
                            </div>
                          ) : (
                            <span>{database.label}</span>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            1/8 vCPU, 1 GB RAM
                          </p>
                        </div>
                      </div>
                    </RadioCardItem>
                  ))}
                </RadioCardGroup>
              </div>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button
                  className="mt-2 w-full sm:mt-0 sm:w-fit"
                  variant="secondary"
                >
                  Go back
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit" className="w-full sm:w-fit">
                  Add workspace
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

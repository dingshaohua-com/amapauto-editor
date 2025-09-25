import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"

import { cn } from "@renderer/lib/utils"
import { Button } from "@renderer/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@renderer/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover"

interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options?: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  emptyMessage?: string
}

export function Combobox({
  options = [],
  value = "",
  onValueChange,
  placeholder = "选择或输入...",
  searchPlaceholder = "搜索或输入...",
  className = "w-[200px]",
  emptyMessage = "没有找到匹配项"
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)

  // 当外部 value 改变时，同步更新 inputValue
  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  // 根据输入内容过滤选项
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return options
    return options.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.value.toLowerCase().includes(inputValue.toLowerCase())
    )
  }, [options, inputValue])

  const handleSelect = (selectedValue: string) => {
    const selectedOption = options.find(option => option.value === selectedValue)
    const newValue = selectedOption ? selectedOption.value : selectedValue
    setInputValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }

  const handleInputChange = (newInputValue: string) => {
    setInputValue(newInputValue)
    onValueChange?.(newInputValue)
    if (!open && newInputValue) {
      setOpen(true)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setOpen(false)
    }
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const displayValue = () => {
    if (!inputValue) return placeholder
    const matchedOption = options.find(option => option.value === inputValue)
    return matchedOption ? matchedOption.label : inputValue
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between hover:bg-gray-50 transition-colors shadow-sm border-gray-200 hover:border-gray-300", className)}
        >
          <span className="truncate">{displayValue()}</span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0 shadow-lg border border-gray-200 rounded-lg bg-white", className)}>
        <Command shouldFilter={false}>
          <div className="flex items-center border-b border-gray-100 px-3 bg-gray-50/50">
            <input
              placeholder={searchPlaceholder}
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 focus:placeholder:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue('')
                  onValueChange?.('')
                }}
                className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                type="button"
              >
                <XIcon className="h-3 w-3 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <CommandList>
            {filteredOptions.length === 0 ? (
              <CommandEmpty className="py-6 text-center text-gray-500">
                {inputValue ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">使用自定义值</span>
                    <span className="font-medium text-blue-600">"{inputValue}"</span>
                  </div>
                ) : (
                  emptyMessage
                )}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4 text-blue-600",
                        inputValue === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
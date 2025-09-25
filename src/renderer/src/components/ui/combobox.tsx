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
  [key: string]: any // 允许额外的自定义属性
}

interface ComboboxProps {
  options?: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  emptyMessage?: string
  // 自定义渲染函数
  renderOption?: (option: ComboboxOption, isSelected: boolean) => React.ReactNode
  renderTrigger?: (value: string, placeholder: string) => React.ReactNode
  renderEmpty?: (searchValue: string, emptyMessage: string) => React.ReactNode
}

export function Combobox({
  options = [],
  value = "",
  onValueChange,
  placeholder = "选择或输入...",
  searchPlaceholder = "搜索或输入...",
  className = "w-[200px]",
  emptyMessage = "没有找到匹配项",
  renderOption,
  renderTrigger,
  renderEmpty
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  // 当外部 value 改变时，同步更新搜索值
  React.useEffect(() => {
    // 如果当前值在选项中存在，且下拉框未打开，则清空搜索框以显示所有选项
    const isValueInOptions = options.some(option => option.value === value)
    if (isValueInOptions && !open) {
      setSearchValue("")
    } else {
      // 如果是自定义值或下拉框已打开，保持搜索值
      setSearchValue(value)
    }
  }, [value, options, open])

  // 当下拉框打开时的处理
  React.useEffect(() => {
    if (open) {
      // 如果当前值在选项中存在，清空搜索框显示所有选项
      const isValueInOptions = options.some(option => option.value === value)
      if (isValueInOptions) {
        setSearchValue("")
      } else {
        // 如果是自定义值，保持在搜索框中
        setSearchValue(value)
      }
    }
  }, [open, value, options])

  // 根据搜索内容过滤选项
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    return options.filter(option =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
      option.value.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue])

  const handleSelect = (selectedValue: string) => {
    const selectedOption = options.find(option => option.value === selectedValue)
    const newValue = selectedOption ? selectedOption.value : selectedValue
    onValueChange?.(newValue)
    setOpen(false)
  }

  const handleSearchChange = (newSearchValue: string) => {
    setSearchValue(newSearchValue)
    onValueChange?.(newSearchValue)
    if (!open && newSearchValue) {
      setOpen(true)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setOpen(false)
    }
    if (e.key === 'Escape') {
      setSearchValue("")
      setOpen(false)
    }
  }

  const displayValue = () => {
    if (!value) return placeholder
    const matchedOption = options.find(option => option.value === value)
    return matchedOption ? matchedOption.label : value
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between hover:bg-gray-50 transition-colors shadow-sm border-gray-200 hover:border-gray-300 pr-12", className)}
          >
            {renderTrigger ? (
              renderTrigger(value, placeholder)
            ) : (
              <>
                <span className="truncate">{displayValue()}</span>
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
          {value && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onValueChange?.('')
              }}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors z-10"
              type="button"
            >
              <XIcon className="h-3 w-3 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0 shadow-lg border border-gray-200 rounded-lg bg-white h-70", className)}>
        <Command shouldFilter={false}>
          <div className="flex items-center border-b border-gray-100 px-3 bg-gray-50/50">
            <input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 focus:placeholder:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {searchValue && (
              <button
                onClick={() => {
                  setSearchValue('')
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
                {renderEmpty ? (
                  renderEmpty(searchValue, emptyMessage)
                ) : searchValue ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">使用自定义值</span>
                    <span className="font-medium text-blue-600">"{searchValue}"</span>
                  </div>
                ) : (
                  emptyMessage
                )}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const isSelected = value === option.value
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className={cn('hover:bg-blue-50 cursor-pointer transition-colors', isSelected &&'text-white bg-blue-400 hover:bg-blue-400')}
                    >
                      {renderOption ? (
                        renderOption(option, isSelected)
                      ) : (
                        <>
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4 text-blue-600",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </>
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// 使用示例：
/*
// 基础用法
<Combobox
  options={options}
  value={value}
  onValueChange={setValue}
/>

// 自定义选项渲染
<Combobox
  options={options}
  value={value}
  onValueChange={setValue}
  renderOption={(option, isSelected) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        {isSelected && <CheckIcon className="mr-2 h-4 w-4 text-blue-600" />}
        <div>
          <div className="font-medium">{option.label}</div>
          <div className="text-sm text-gray-500">{option.description}</div>
        </div>
      </div>
      {option.badge && (
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
          {option.badge}
        </span>
      )}
    </div>
  )}
/>

// 自定义触发器渲染
<Combobox
  options={options}
  value={value}
  onValueChange={setValue}
  renderTrigger={(value, placeholder) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <UserIcon className="mr-2 h-4 w-4" />
        <span>{value || placeholder}</span>
      </div>
      <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
    </div>
  )}
/>

// 自定义空状态渲染
<Combobox
  options={options}
  value={value}
  onValueChange={setValue}
  renderEmpty={(searchValue, emptyMessage) => (
    <div className="py-6 text-center">
      <div className="text-gray-500 mb-2">{emptyMessage}</div>
      {searchValue && (
        <button className="text-blue-600 hover:text-blue-800">
          创建 "{searchValue}"
        </button>
      )}
    </div>
  )}
/>
*/
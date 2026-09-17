/*
 * STM32 花样流水灯示例程序（HAL 库版本）
 *
 * 硬件连接示例：
 *   LED0~LED7 分别接到 GPIOC 的 PC0~PC7，引脚高电平点亮。
 *   如果你的开发板是低电平点亮，请把 LED_ON/LED_OFF 对调即可。
 *
 * 使用方法：
 *   1. 在 STM32CubeMX/STM32CubeIDE 中创建工程并启用 PC0~PC7 为 GPIO_Output。
 *   2. 将本文件中的用户代码复制到 main.c，或把本文件加入工程后保留一个 main() 入口。
 *   3. 根据实际芯片修改 SystemClock_Config()。下方给出的是 STM32F103 常见 72MHz 配置。
 */

#include "stm32f1xx_hal.h"

#define LED_GPIO_PORT GPIOC
#define LED_PIN_MASK  (GPIO_PIN_0 | GPIO_PIN_1 | GPIO_PIN_2 | GPIO_PIN_3 | \
                       GPIO_PIN_4 | GPIO_PIN_5 | GPIO_PIN_6 | GPIO_PIN_7)

#define LED_ON  GPIO_PIN_SET
#define LED_OFF GPIO_PIN_RESET

static void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void LED_WritePattern(uint8_t pattern);
static void LED_AllOff(void);
static void Pattern_LeftToRight(uint16_t delay_ms);
static void Pattern_RightToLeft(uint16_t delay_ms);
static void Pattern_CenterToSides(uint16_t delay_ms);
static void Pattern_SidesToCenter(uint16_t delay_ms);
static void Pattern_Blink(uint8_t times, uint16_t delay_ms);

int main(void)
{
    HAL_Init();
    SystemClock_Config();
    MX_GPIO_Init();

    while (1)
    {
        Pattern_LeftToRight(120);     /* 从左到右单灯流水 */
        Pattern_RightToLeft(120);     /* 从右到左单灯流水 */
        Pattern_CenterToSides(160);   /* 中间向两边扩散 */
        Pattern_SidesToCenter(160);   /* 两边向中间汇聚 */
        Pattern_Blink(3, 180);        /* 全亮全灭闪烁 */
    }
}

static void LED_WritePattern(uint8_t pattern)
{
    for (uint8_t i = 0; i < 8; ++i)
    {
        GPIO_PinState state = (pattern & (1U << i)) ? LED_ON : LED_OFF;
        HAL_GPIO_WritePin(LED_GPIO_PORT, (uint16_t)(GPIO_PIN_0 << i), state);
    }
}

static void LED_AllOff(void)
{
    LED_WritePattern(0x00U);
}

static void Pattern_LeftToRight(uint16_t delay_ms)
{
    for (uint8_t i = 0; i < 8; ++i)
    {
        LED_WritePattern((uint8_t)(1U << i));
        HAL_Delay(delay_ms);
    }
    LED_AllOff();
}

static void Pattern_RightToLeft(uint16_t delay_ms)
{
    for (int8_t i = 7; i >= 0; --i)
    {
        LED_WritePattern((uint8_t)(1U << i));
        HAL_Delay(delay_ms);
    }
    LED_AllOff();
}

static void Pattern_CenterToSides(uint16_t delay_ms)
{
    const uint8_t patterns[] = {0x18U, 0x24U, 0x42U, 0x81U};

    for (uint8_t i = 0; i < sizeof(patterns); ++i)
    {
        LED_WritePattern(patterns[i]);
        HAL_Delay(delay_ms);
    }
    LED_AllOff();
}

static void Pattern_SidesToCenter(uint16_t delay_ms)
{
    const uint8_t patterns[] = {0x81U, 0x42U, 0x24U, 0x18U};

    for (uint8_t i = 0; i < sizeof(patterns); ++i)
    {
        LED_WritePattern(patterns[i]);
        HAL_Delay(delay_ms);
    }
    LED_AllOff();
}

static void Pattern_Blink(uint8_t times, uint16_t delay_ms)
{
    for (uint8_t i = 0; i < times; ++i)
    {
        LED_WritePattern(0xFFU);
        HAL_Delay(delay_ms);
        LED_AllOff();
        HAL_Delay(delay_ms);
    }
}

static void MX_GPIO_Init(void)
{
    GPIO_InitTypeDef GPIO_InitStruct = {0};

    __HAL_RCC_GPIOC_CLK_ENABLE();

    HAL_GPIO_WritePin(LED_GPIO_PORT, LED_PIN_MASK, LED_OFF);

    GPIO_InitStruct.Pin = LED_PIN_MASK;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    HAL_GPIO_Init(LED_GPIO_PORT, &GPIO_InitStruct);
}

static void SystemClock_Config(void)
{
    RCC_OscInitTypeDef RCC_OscInitStruct = {0};
    RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

    RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
    RCC_OscInitStruct.HSEState = RCC_HSE_ON;
    RCC_OscInitStruct.HSEPredivValue = RCC_HSE_PREDIV_DIV1;
    RCC_OscInitStruct.HSIState = RCC_HSI_ON;
    RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
    RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSE;
    RCC_OscInitStruct.PLL.PLLMUL = RCC_PLL_MUL9;
    if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
    {
        while (1) {
        }
    }

    RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK | RCC_CLOCKTYPE_SYSCLK |
                                  RCC_CLOCKTYPE_PCLK1 | RCC_CLOCKTYPE_PCLK2;
    RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
    RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
    RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV2;
    RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

    if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_2) != HAL_OK)
    {
        while (1) {
        }
    }
}

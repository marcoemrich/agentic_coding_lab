import java.util.List;

public record QuoteStep(List<Item> items) implements Step {
}

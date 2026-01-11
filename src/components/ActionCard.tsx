import { QuickActionType } from "@/constants";
import { Card } from "./ui/card";

function ActionCard({
  action,
  onClick,
}: {
  action: QuickActionType;
  onClick: () => void;
}) {
  return (
    <Card
      className="group relative overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      {/* Action gradient */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${action.gradient} opacity-100 group-hover:opacity-50 transition-opacity`}
      />
      {/* Action content wrapper */}
      <div className="relative p-6 size-full">
        <div className="space-y-3">
          {/* Action Icon */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center bg-${action.color}/10 group-hover:scale-110 transition-transform`}
          >
            <action.icon className={`h-6 w-6 text-${action.color}`} />
          </div>

          {/* action details */}

          <div className="space-y-1">
            <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {action.description}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ActionCard;
